<template>
  <transition name="slide">
    <music-list
      :title="title"
      :bg-image="bgImage"
      :songs="songs"
      :rank="rank"
    ></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from "../../components/music-list/music-list";
import { mapGetters } from "vuex";
import { getMusicList } from "../../api/rank.js";
import { ERR_OK } from "../../api/config.js";
import { createSong, processSongsUrl } from "../../common/js/song.js";

export default {
  data() {
    return {
      songs: [],
      rank: true
    };
  },
  created() {
    console.log(this);
    this._getMusicList();
  },
  computed: {
    title() {
      return this.topList.topTitle;
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image;
      } else {
        return "";
      }
    },
    ...mapGetters(["topList"])
  },
  methods: {
    _getMusicList() {
      if (!this.topList.id) {
        this.$router.push("/rank");
        return;
      }
      getMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          processSongsUrl(this.normalizeSongs(res.songlist)).then(songs => {
            this.songs = songs;
          });
        }
      });
    },
    normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        const musicData = item.data;
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  },
  components: {
    MusicList
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>