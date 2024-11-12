
Solutions for dynamic src binding:

1. With static URL
```
<script setup>
import imageUrl from '@/assets/images/logo.svg' // => or relative path
</script>

<template>
  <img :src="imageUrl" alt="img" />
</template>
```

2. With dynamic URL & relative path
```
<script setup>
const imageUrl = new URL(`./dir/${name}.png`, import.meta.url).href
</script>

<template>
  <img :src="imageUrl" alt="img" />
</template>
```

3. With dynamic URL & absolute path, computed
```
<script setup>
import { computed } from 'vue'

const props = defineProps({
    name: String,
})

const imageUrl = computed(
    () => new URL(`@/assets/images/${props.name}.png`, import.meta.url).href
);
</script>

<template>
  <img :src="imageUrl" />
</template>
```

4. With dynamic URL & absolute path
Due to Rollup Limitations, all imports must start relative to the importing file and should not start with a variable.

replace the alias @/ with /src

```
<script setup>
const imageUrl = new URL('/src/assets/images/logo.svg', import.meta.url)
</script>

<template>
  <img :src="imageUrl" alt="img" />
</template>

<script setup>
const imageUrl = new URL('./logo.png', import.meta.url).href
</script>

<template>
<img :src="imageUrl" />
</template>
```

Note that it doesn't work with SSR