<template>
    <p class="">{{text}}</p>
</template>

<script setup lang="ts">
let props = defineProps({
    text:{
        type: String
    }
})
</script>

<style scoped>

</style>