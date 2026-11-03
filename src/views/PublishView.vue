<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { publishItem } from '../api/items'
import { CAMPUSES, CATEGORIES, CHANNELS } from '../mock/items'

const router = useRouter()

const form = reactive({
  title: '',
  price: '',
  originalPrice: '',
  category: '',
  campus: '',
  channel: '',
  contact: '',
  rawText: '',
})

const images = ref<string[]>([])
const errors = reactive<Record<string, string>>({})
const submitting = ref(false)
const submitError = ref('')

function validate(): boolean {
  const title = form.title.trim()
  errors.title = !title ? '请填写标题' : title.length < 2 ? '标题至少 2 个字' : ''

  const price = Number(form.price)
  errors.price =
    form.price === ''
      ? '请填写价格'
      : !Number.isFinite(price) || price <= 0
        ? '价格需为大于 0 的数字'
        : ''

  if (form.originalPrice !== '') {
    const op = Number(form.originalPrice)
    errors.originalPrice = !Number.isFinite(op) || op <= 0 ? '原价需为大于 0 的数字' : op <= price ? '原价应高于售价' : ''
  } else {
    errors.originalPrice = ''
  }

  errors.category = form.category ? '' : '请选择分类'
  errors.campus = form.campus ? '' : '请选择校区'
  errors.channel = form.channel ? '' : '请选择频道'

  const raw = form.rawText.trim()
  errors.rawText = !raw ? '请填写商品描述' : raw.length < 5 ? '描述至少 5 个字' : raw.length > 500 ? '描述不超过 500 字' : ''

  return !Object.values(errors).some(Boolean)
}

function onPickImages(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (!files) return
  for (const file of Array.from(files)) {
    if (images.value.length >= 6) break
    if (!file.type.startsWith('image/')) continue
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') images.value.push(reader.result)
    }
    reader.readAsDataURL(file)
  }
  input.value = ''
}

function removeImage(i: number) {
  images.value.splice(i, 1)
}

async function submit() {
  submitError.value = ''
  if (!validate()) return
  submitting.value = true
  try {
    await publishItem({
      title: form.title.trim(),
      price: Number(form.price),
      originalPrice: form.originalPrice === '' ? undefined : Number(form.originalPrice),
      category: form.category,
      campus: form.campus,
      channel: form.channel,
      contact: form.contact.trim() || undefined,
      rawText: form.rawText.trim(),
      images: [...images.value],
    })
    router.push({ name: 'mine' })
  } catch (e) {
    submitError.value = e instanceof Error ? e.message : '发布失败，请稍后重试'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="container narrow">
    <h1 class="page-title">发布闲置</h1>
    <p class="page-desc">信息将发布到所选 QQ 校园频道，仅限校内当面交易。</p>

    <form class="card form" @submit.prevent="submit">
      <div class="field">
        <label class="field__label">标题 <span class="req">*</span></label>
        <input v-model="form.title" class="input" placeholder="例如：高等数学同济第七版 上下册" />
        <span v-if="errors.title" class="field__error">{{ errors.title }}</span>
      </div>

      <div class="form__row">
        <div class="field">
          <label class="field__label">售价（元）<span class="req">*</span></label>
          <input v-model="form.price" class="input" type="number" min="0" placeholder="25" />
          <span v-if="errors.price" class="field__error">{{ errors.price }}</span>
        </div>
        <div class="field">
          <label class="field__label">原价（元，可选）</label>
          <input v-model="form.originalPrice" class="input" type="number" min="0" placeholder="78" />
          <span v-if="errors.originalPrice" class="field__error">{{ errors.originalPrice }}</span>
        </div>
      </div>

      <div class="form__row">
        <div class="field">
          <label class="field__label">分类 <span class="req">*</span></label>
          <select v-model="form.category" class="select">
            <option value="" disabled>请选择</option>
            <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
          </select>
          <span v-if="errors.category" class="field__error">{{ errors.category }}</span>
        </div>
        <div class="field">
          <label class="field__label">校区 <span class="req">*</span></label>
          <select v-model="form.campus" class="select">
            <option value="" disabled>请选择</option>
            <option v-for="c in CAMPUSES" :key="c" :value="c">{{ c }}</option>
          </select>
          <span v-if="errors.campus" class="field__error">{{ errors.campus }}</span>
        </div>
        <div class="field">
          <label class="field__label">频道 <span class="req">*</span></label>
          <select v-model="form.channel" class="select">
            <option value="" disabled>请选择</option>
            <option v-for="c in CHANNELS" :key="c" :value="c">{{ c }}</option>
          </select>
          <span v-if="errors.channel" class="field__error">{{ errors.channel }}</span>
        </div>
      </div>

      <div class="field">
        <label class="field__label">联系方式（可选）</label>
        <input v-model="form.contact" class="input" placeholder="QQ / 微信，建议面交后私下交换" />
      </div>

      <div class="field">
        <label class="field__label">商品描述 <span class="req">*</span></label>
        <textarea
          v-model="form.rawText"
          class="textarea"
          placeholder="描述成色、使用情况、出手原因等，至少 5 个字"
        ></textarea>
        <span v-if="errors.rawText" class="field__error">{{ errors.rawText }}</span>
      </div>

      <div class="field">
        <label class="field__label">图片（最多 6 张）</label>
        <div class="uploader">
          <div v-for="(img, i) in images" :key="i" class="uploader__item">
            <img :src="img" alt="预览图" />
            <button type="button" class="uploader__remove" @click="removeImage(i)">×</button>
          </div>
          <label v-if="images.length < 6" class="uploader__add">
            <input type="file" accept="image/*" multiple @change="onPickImages" />
            <span>＋</span>
          </label>
        </div>
      </div>

      <p v-if="submitError" class="field__error" style="margin-bottom: 4px">{{ submitError }}</p>

      <div class="form__actions">
        <button type="button" class="btn btn--ghost" @click="router.back()">取消</button>
        <button type="submit" class="btn btn--primary" :disabled="submitting">
          {{ submitting ? '发布中…' : '发布' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.narrow {
  width: min(760px, calc(100% - 40px));
}

.page-title {
  font-size: 22px;
  font-weight: 700;
}

.page-desc {
  color: var(--muted);
  font-size: 13px;
  margin: 6px 0 18px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 26px 28px;
}

.form__row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.uploader {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.uploader__item {
  position: relative;
  width: 84px;
  height: 84px;
}

.uploader__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid var(--line);
}

.uploader__remove {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 14px;
  line-height: 1;
}

.uploader__add {
  display: grid;
  place-items: center;
  width: 84px;
  height: 84px;
  border: 1px dashed #c9cede;
  border-radius: 10px;
  color: var(--muted);
  font-size: 24px;
  cursor: pointer;
}

.uploader__add input {
  display: none;
}

@media (max-width: 720px) {
  .form__row {
    grid-template-columns: 1fr;
  }
}
</style>
