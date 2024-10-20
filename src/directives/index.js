export default (app) => {
  //自定义组件
  app.directive("onReset", {
    mounted(el, binding) {
      // 这里使用debounce防抖处理，防抖的延时时间可以通过自定义指令的参数传过来，如`v-resize:300`表示300ms延时
      // 也可以将此处延时去掉，放在绑定的函数中自定义
      function debounce(fn, delay = 16) {
        let t = null;
        return function () {
          if (t) {
            clearTimeout(t);
          }
          const context = this;
          const args = arguments;
          t = setTimeout(function () {
            fn.apply(context, args);
          }, delay);
        };
      }
      el._resizer = new window.ResizeObserver(
        debounce(binding.value, Number(binding.arg) || 16)
      );
      el._resizer.observe(el);
    },
    unmounted(el) {
      el._resizer.disconnect();
    },
  });
  app.directive("resizing", {
    mounted(el, binding) {
      // 这里使用debounce防抖处理，防抖的延时时间可以通过自定义指令的参数传过来，如`v-resize:300`表示300ms延时
      // 也可以将此处延时去掉，放在绑定的函数中自定义
      function debounce(fn, delay = 0) {
        let t = null;
        return function () {
          if (t) {
            clearTimeout(t);
          }
          const context = this;
          const args = arguments;
          t = setTimeout(function () {
            fn.apply(context, args);
          }, delay);
        };
      }
      el._resizer = new window.ResizeObserver(
        debounce(binding.value, Number(binding.arg) || 0)
      );
      el._resizer.observe(el);
    },
    unmounted(el) {
      el._resizer.disconnect();
    },
  });
  app.directive("onScroll", {
    mounted(el, binding) {
      const handleScroll = () => {
        let scrollHeight = Math.floor(el.scrollHeight)
        let scrollTop = Math.floor(el.scrollTop)
        let clientHeight = Math.floor(el.clientHeight)
        
        if (scrollHeight - scrollTop === clientHeight || (scrollHeight - scrollTop) % clientHeight < 20 ) {
          binding.value(); // Trigger the provided function when scroll reaches bottom
        }
      };

      // 如果内容超过容器高度，再绑定滚动事件
      if (el.scrollHeight > el.clientHeight) {
        el.addEventListener("scroll", handleScroll);
      } else {
        binding.value(); // Trigger the provided function when scroll reaches bottom
      }

      // Store the event listener function for later removal
      el._handleScroll = handleScroll;
    },
    unmounted(el) {
      // Remove the event listener when the component is about to be unmounted
      el.removeEventListener("scroll", el._handleScroll);
    },
  });
};
