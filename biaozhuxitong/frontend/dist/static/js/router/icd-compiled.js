import _JSON$stringify from 'babel-runtime/core-js/json/stringify';
var MatchICD = Vue.extend({
  template: '#icd',
  props: ['id'],

  data: function data() {
    return {
      icds: "",
      source_list: {},
      ischeck: {},
      match_result: "" //是否有返回值
    };
  },
  beforeMount: function beforeMount() {
    this.init(this.$route.params.id);
  },
  watch: {
    //默认Vue只在第一次加载初始化，watch用于检测Vue实例的数据是否发生了变化，变化后触发事件
    '$route': function $route(to, from) {
      //跳转的路径（to）
      db = to.path.split("/")[to.path.split("/").length - 1];
      this.init(db);
    }
  },
  components: {
    pg: Page
  },
  methods: {
    init: function init(db) {
      this.icds = "";
      this.match_result = "";
      $("#diag").val("");
      var _self = this;
      $.ajax({
        type: "post",
        url: "/load_source/",
        data: { db: db },
        success: function success(data) {
          _self.source_list = data["source"];
          _self.ischeck = data["ischeck"];
        }
      });
    },
    match: function match() {
      dis = $(this.$refs.diag).val().trim();
      source_list = [];
      for (k in this.ischeck) {
        if (this.ischeck[k]) {
          source_list.push(k);
        }
      }
      if (vutils.jsonLength(source_list) > 0) {
        var _self = this;
        $.ajax({
          type: "post",
          url: "/match_icd/",
          data: { dis: dis, source_list: _JSON$stringify(source_list), db: _self.$route.params.id },
          success: function success(data) {
            _self.icds = data["res"][0][1];
            if (vutils.isEmptyObject(data[dis])) {
              _self.match_result = "暂无结果";
            } else _self.match_result = "";
          }
        });
      } else {
        this.match_result = "暂无结果";
        this.icds = "";
        toastr.error("请选择术语集来源");
      }
    },
    has_element: function has_element(arr, b) {
      return vutils.has_element(arr[arr.length - 1], b);
    },
    get_index: function get_index(index) {
      return index + 1;
    }

  }
});

//# sourceMappingURL=icd-compiled.js.map