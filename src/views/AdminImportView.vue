<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import { useAdminStore } from '../stores/admin'

const router = useRouter()
const adminStore = useAdminStore()

const importSteps = [
  '上传 Word、Markdown 或粘贴 AI 生成的路书文本',
  '自动识别标题、简介、时间轴、导航点、分段和返程方案',
  '调用高德搜索补全经纬度，管理员确认后生成草稿',
  '后台补充车辆续航、注意事项和发布状态',
]

const supportedFields = [
  '路书标题',
  '时间轴',
  '导航点顺序',
  '分段说明',
  '午休/餐饮',
  '返程方案',
  '装备清单',
  '安全注意事项',
]

onMounted(() => {
  if (!adminStore.isAuthed) {
    router.replace('/admin')
  }
})
</script>

<template>
  <AdminLayout>
    <section class="import-page">
      <div class="head">
        <div>
          <RouterLink to="/admin/trips">返回路书管理</RouterLink>
          <h1>智能路书导入</h1>
          <p>
            第一版把 GPX 降级为高级能力，优先支持 Word、Markdown 和纯文本路书，
            更适合真实摩旅组织者从 AI 文档或微信群资料生成可发布路书。
          </p>
        </div>
        <span class="status-pill">设计中</span>
      </div>

      <div class="grid">
        <section class="soft-card panel">
          <h2>导入流程</h2>
          <ol>
            <li v-for="step in importSteps" :key="step">{{ step }}</li>
          </ol>
        </section>

        <section class="soft-card panel">
          <h2>可识别字段</h2>
          <div class="chips">
            <span v-for="field in supportedFields" :key="field" class="tag">{{ field }}</span>
          </div>
        </section>
      </div>

      <section class="soft-card panel">
        <h2>陆浑站导入样例</h2>
        <p>
          已将“交投F4+ 磨合路书 - 陆浑站 V2.0”整理为系统内置样例。
          这类文档导入后应默认生成草稿，由管理员确认每个导航点的高德地点和经纬度，再发布到前台。
        </p>
        <RouterLink class="sample-link" to="/trip/luhun-break-in">查看前台样例</RouterLink>
      </section>
    </section>
  </AdminLayout>
</template>

<style scoped>
.import-page {
  display: grid;
  gap: 18px;
}

.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

h1,
h2,
p,
ol {
  margin: 0;
}

h1 {
  margin-top: 8px;
}

p {
  margin-top: 8px;
  color: var(--muted);
  line-height: 1.7;
}

.status-pill {
  flex: none;
  padding: 8px 12px;
  border-radius: 999px;
  color: #fffaf1;
  background: var(--amber);
}

.grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 18px;
}

.panel {
  padding: 20px;
}

ol {
  display: grid;
  gap: 12px;
  padding-left: 22px;
  color: var(--muted);
  line-height: 1.7;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.sample-link {
  display: inline-flex;
  margin-top: 16px;
  padding: 10px 14px;
  border-radius: 8px;
  color: #fffaf1;
  background: var(--green-dark);
}

@media (max-width: 860px) {
  .head,
  .grid {
    display: grid;
    grid-template-columns: 1fr;
  }
}
</style>
