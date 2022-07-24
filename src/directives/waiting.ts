/**
 * @file file description
 * @author trydofor
 * @since 2021-11-17
 * @see {@link http://github.com/trydofor | trydofor}
 */
import { Directive, DirectiveBinding } from 'vue';

export default {
  mounted(el, binding: DirectiveBinding<number | undefined>) {
    const ms = binding.value || 500;
    el.addEventListener('click', () => {
      el.disabled = true;
      el.style.pointerEvents = 'none';
      window.setTimeout(() => {
        el.disabled = false;
        el.style.pointerEvents = 'auto';
      }, ms);
    });
  },
} as Directive;
