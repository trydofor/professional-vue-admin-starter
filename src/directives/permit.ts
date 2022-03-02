/**
 * @file file description
 * @author trydofor
 * @since 2021-11-17
 * @see {@link http://github.com/trydofor | trydofor}
 */
import { Directive } from 'vue';
import { DirectiveBinding } from '@vue/runtime-core';
import { hasPermit } from '@/libs/permit-helper';

export default {
  mounted(el, binding: DirectiveBinding<string | string[]>) {
    const had = hasPermit(binding.value);
    if (had == null) {
      throw new Error('use v-permit="Permit.RoleAdmin"/v-permit="[Permit.RoleAdmin]"');
    } else if (!had) {
      el.style.display = 'none';
    }
  },
} as Directive;
