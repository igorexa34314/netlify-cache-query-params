import type { RouteParamValueRaw, LocationQuery } from 'vue-router';

export type RouteQueryValueRaw = RouteParamValueRaw | string[];

export interface ReactiveRouteOptions {
	/**
	 * Mode to update the router query, ref is also acceptable
	 *
	 * @default 'replace'
	 */
	mode?: MaybeRef<'replace' | 'push'>;

	/**
	 * Route instance, use `useRoute()` if not given
	 */
	route?: ReturnType<typeof useRoute>;

	/**
	 * Router instance, use `useRouter()` if not given
	 */
	router?: ReturnType<typeof useRouter>;
}

export interface ReactiveRouteOptionsWithTransform<V, R> extends ReactiveRouteOptions {
	/**
	 * Function to transform data before return
	 */
	transform?: (val: V) => R;
}

const _queue = new WeakMap<ReturnType<typeof useRouter>, Map<string, any>>();

export function useRouteQuery(name: string): Ref<null | string | string[]>;

/**
 * Copied from \@vueuse/router
 * @param name
 * @param defaultValue
 * @param options
 */
export function useRouteQuery<T extends RouteQueryValueRaw = RouteQueryValueRaw, K = T>(
	name: string,
	defaultValue?: MaybeRefOrGetter<T>,
	options?: ReactiveRouteOptionsWithTransform<T, K>
): Ref<K>;

export function useRouteQuery<T extends RouteQueryValueRaw = RouteQueryValueRaw, K = T>(
	name: string,
	defaultValue?: MaybeRefOrGetter<T>,
	options: ReactiveRouteOptionsWithTransform<T, K> = {}
): Ref<K> {
	const { mode = 'replace', transform = value => value as any as K } = options;

	const route = useRoute();
	const router = useRouter();

	if (!_queue.has(router)) _queue.set(router, new Map());

	const _queriesQueue = _queue.get(router)!;

	let query: LocationQuery[string] | undefined = route.query[name];

	tryOnScopeDispose(() => {
		query = undefined;
	});

	let _trigger: () => void;

	const proxy = customRef<any>((track, trigger) => {
		_trigger = trigger;

		return {
			get() {
				track();

				return transform((query !== undefined ? query : toValue(defaultValue)) as T);
			},
			set(v) {
				if (query === v) return;

				query = v === defaultValue || v === null ? undefined : v;
				_queriesQueue.set(name, v === defaultValue || v === null ? undefined : v);

				trigger();

				nextTick(() => {
					if (_queriesQueue.size === 0) return;

					const newQueries = Object.fromEntries(_queriesQueue.entries());
					_queriesQueue.clear();

					const { params, query, hash } = route;

					router[toValue(mode)]({
						params,
						query: { ...query, ...newQueries },
						hash,
					});
				});
			},
		};
	});

	watch(
		() => route.query[name],
		v => {
			query = v;

			_trigger();
		},
		{ flush: 'sync' }
	);

	return proxy as any as Ref<K>;
}
