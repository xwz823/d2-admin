import { defineComponent, computed, ref, watch } from 'vue'
import classNames from 'classnames'
import { useConfigForD2Components } from '../../../use/config.js'
import { makeComponentName, makeComponentClassName } from '../../../utils/make.js'
import { isSize, isColor } from '../../../utils/const.js'

export const name = makeComponentName('input')
export const mainClassName = makeComponentClassName('input')

export default defineComponent({
  name,
  inheritAttrs: false,
  props: {
    value: { type: [String, Number], default: '' },
    size: { type: String, default: '', validator: value => isSize(value, true) },
    color: { type: String, default: '', validator: value => isColor(value, true) }
  },
  emits: [
    'update:value'
  ],
  setup (props, { attrs, slots, emit }) {
    const $D2COM = useConfigForD2Components()

    const currentValue = ref(props.value || '')
    
    // size
    const inputSize = computed(() => props.size || $D2COM.size)

    // color
    const inputColor = computed(() => props.color)

    watch(() => props.value, (value) => {
      currentValue.value = value
    })

    const inputClassName = computed(() => classNames(
      mainClassName,
      {
        [`${mainClassName}--${inputSize.value}`]: inputSize.value,
        [`${mainClassName}--${inputColor.value}`]: inputColor.value,
        [attrs.class]: attrs.class
      }
    ))

    function handleChange (e) {
      const value = e.target.value
      currentValue.value = value
      emit('update:value', value)
    }

    function createInput () {
      return <input
        class={ inputClassName.value }
        value={ currentValue.value }
        onInput={ handleChange }
        onChange={ handleChange }
      />
    }
    
    return () => createInput()
  }
})
