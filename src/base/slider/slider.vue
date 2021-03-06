<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span
        class="dot"
        v-for="(item, index) in dots"
        :key="index"
        :class="{ active: currentPageIndex === index }"
      ></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from "better-scroll";
import { addClass } from "common/js/dom";

export default {
  name: "slider",
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    };
  },
  mounted() {
    setTimeout(() => {
      this.setSliderWidth();
      this.initDots();
      this.initSlider();
      if (this.autoPlay) {
        this.play();
      }
    }, 20);

    window.addEventListener("resize", () => {
      if (!this.slider || !this.slider.enabled) {
        return;
      }
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        if (this.slider.isInTransition) {
          this.onScrollEnd();
        } else {
          if (this.autoPlay) {
            this.play();
          }
        }
        this.refresh();
      }, 60);
    });
  },
  activated() {
    this.slider.enable();
    let pageIndex = this.slider.getCurrentPage().pageX;
    this.slider.goToPage(pageIndex, 0, 0);
    this.currentPageIndex = pageIndex;
    if (this.autoPlay) {
      this.play();
    }
  },
  deactivated() {
    this.slider.disable();
    clearTimeout(this.timer);
  },
  beforeDestroy() {
    this.slider.disable();
    clearTimeout(this.timer);
  },
  methods: {
    refresh() {
      if (this.slider) {
        this.setSliderWidth(true);
        this.slider.refresh();
      }
    },
    setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children;
      console.log(this.children)
      let width = 0;
      let sliderWidth = this.$refs.slider.clientWidth;
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        addClass(child, "slider-item");
        child.style.width = sliderWidth + "px";
        width += sliderWidth;
      }

      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }
      this.$refs.sliderGroup.style.width = width + "px";
    },
    initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      });
      console.log(this.slider)
      this.slider.on("scrollEnd", this.onScrollEnd);

      this.slider.on("touchend", () => {
        if (this.autoPlay) {
          this.play();
        }
      });

      this.slider.on("beforeScrollStart", () => {
        if (this.autoPlay) {
          clearTimeout(this.timer);
        }
      });
    },
    onScrollEnd() {
      let pageIndex = this.slider.getCurrentPage().pageX;
      this.currentPageIndex = pageIndex;
      if (this.autoPlay) {
        this.play();
      }
    },
    initDots() {
      this.dots = new Array(this.children.length);
    },
    play() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.slider.next();
      }, this.interval);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.slider {
  min-height: 1px;

  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;

      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;

    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $color-text-l;

      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }
}
</style>
