<template>
	<div v-if="data" style="max-width: 480px">
		<div style="display: flex; align-items: center; justify-content: space-between">
			<h2>Leaderboards</h2>
			<select id="leaderboard-type" v-model="leaderboardType">
				<option v-for="t in leaderboardTypes" :key="t" :value="t" :selected="t === leaderboardType">
					{{ t.charAt(0).toUpperCase() + t.slice(1) }}
				</option>
			</select>
		</div>

		<table>
			<thead>
				<tr>
					<th width="10%">Place</th>
					<th width="55%" align="center">User</th>
					<th width="20%" align="right">Points</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="userdata in data[leaderboardType]" :key="userdata.id">
					<td width="10%">{{ userdata.place }}</td>
					<td width="55%">{{ userdata.fullname }}</td>
					<td width="20%" align="right">{{ userdata.points }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
const leaderboardType = useRouteQuery<string>('type', '');

const { data } = await useFetch('/api/leaderboard');

const leaderboardTypes = computed(() => Object.keys(data.value || {}));

if (!leaderboardTypes.value.includes(leaderboardType.value)) {
	leaderboardType.value = leaderboardTypes.value[0];
}
</script>
