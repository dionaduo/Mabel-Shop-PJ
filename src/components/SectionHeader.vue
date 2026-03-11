<template>
  <div class="section-header">
    <span class="title">{{ title }}</span>
    <span class="link" @click="$emit('on-link-click')">
      {{ linkText }}
      <van-icon name="arrow" />
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  linkText: string
}>()

defineEmits<{
  (e: 'on-link-click'): void
}>()
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0 12px;
  padding: 0 4px;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  position: relative;
  padding-left: 10px;
}

.title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 18px;
  background: #ff6b6b;
  border-radius: 2px;
}

.link {
  font-size: 13px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 2px;
}
</style>