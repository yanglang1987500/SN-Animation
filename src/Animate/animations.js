import PubSub from './pubsub';

const width = 578, height = 143;
/* eslint-disable */
const Animations = {
  init: function (dom) {
    SNAnimation.ImageManager.addImages({
      'zhuang_1':require('./images/zhuang_1.png'),
      'zhuang_2':require('./images/zhuang2.png'),
      'zhuang':require('./images/zhuang.png'),
      'kaishi_2':require('./images/kaishi_2.png'),
      'kaishi_1':require('./images/kaishi_1.png'),
      'start2':require('./images/start2.png'),
      'yanwu':require('./images/yanwu.png'),
      'sailormars':require('./images/sailormars.png'),
      'feiji_1':require('./images/feiji_1.png'),
      'feiji(2)':require('./images/feiji(2).png'),
      'feiji(3)':require('./images/feiji(3).png'),
      'win':require('./images/win.png'),
      'winback':require('./images/winback.png'),
      'lose':require('./images/lose.png'),
      'loseback':require('./images/loseback.png'),
      'gifbg': require('./gif/bg.jpg'),
      'gifflex': require('./gif/flex.png'),
      'gifplane': require('./gif/plane.png'),
      'gifsun': require('./gif/sun.png'),
      'gifyun': require('./gif/yun.png'),
    });
    /*  PubSub.subscribe('__SNANI_SOUNDMANAGER_LOADED',function(){

          SNAnimation.AudioManager.setBackgroundMusic('../audio/music_Mainscene.mp3',{loops:999}).addAudio({
              plane:'../audio/effect_Largeaircraft_clip.mp3'
          });
          
      });*/
    const rect = dom.getBoundingClientRect();
    SNAnimation.Renderer.load(dom);
    this.width = dom.style.width || rect.width;
    this.height = dom.style.height || rect.height;
    var that = this;
    PubSub.subscribe('onorientationchange', function () {
      const rect = dom.getBoundingClientRect();
      that.width = rect.width;
      that.height = rect.height;
    });
    SNAnimation.Renderer.start();
    return this;
  },
  clear: function(){
    SNAnimation.Renderer.clearLayer();
  },
  gif: {
    layer: null,
    remove: function () {
      SNAnimation.Renderer.stop();
      this.layer && this.layer.remove();
    },
    rerun: function () {
      this.flex.x = 85 - 200;
      this.plane.x = -200;
      Math.tween.get(this.plane).to({ x: 180 }, 1000, Math.tween.Linear);
      Math.tween.get(this.flex).to({ x: 265 }, 1000, Math.tween.Linear);
    },
    run: function () {
      this.layer && this.layer.remove();
      //创建一个装载精灵的图层
      this.layer = new SNAnimation.Layer({
        width,//图层宽 
        height,//图层高 
        autorender: true,//是否自动渲染，如果是，初始化好之后便会出现在屏幕上，否则调用start方法之后才会开始渲染
        autostart: true//是否自动开始精灵动画（此精灵动画指的是循环切换图片上的小精灵）
      });
      //创建一个精灵
      var bgsprite1 = new SNAnimation.DisplayObject({
        width: 1081,//精灵图片上一个单位精灵的原始宽
        height: 145,//精灵图片上一个单位精灵的原始高
        drawWidth: 1081,//实际绘制宽度
        drawHeight: 145,//实际绘制高度 比如可以缩放绘制 通过这两个属性结合Math.tween.get().to可以做到放大缩小等动画
        removeWhenEnd: false,//是否动画执行完毕后自动移除
        backgroundImage: 'gifbg'//精灵图片key 由 SNAnimation.ImageManager统一管理
      }).addTo(this.layer);
      //创建一个动画
      SNAnimation.Timer.cycle(bgsprite1, '12fps', {//帧率为12fps
        delay: 0//延时播放
      });

      //创建一个精灵
      var bgsprite2 = new SNAnimation.DisplayObject({
        x: 1075,//精灵的x坐标
        width: 1081,//精灵图片上一个单位精灵的原始宽
        height: 145,//精灵图片上一个单位精灵的原始高
        drawWidth: 1081,//实际绘制宽度
        drawHeight: 145,//实际绘制高度 比如可以缩放绘制 通过这两个属性结合Math.tween.get().to可以做到放大缩小等动画
        removeWhenEnd: false,//是否动画执行完毕后自动移除
        backgroundImage: 'gifbg'//精灵图片key 由 SNAnimation.ImageManager统一管理
      }).addTo(this.layer);
      //创建一个动画
      SNAnimation.Timer.cycle(bgsprite1, '12fps', {//帧率为12fps
        delay: 0//延时播放
      });
      //创建一个动画
      SNAnimation.Timer.cycle(bgsprite2, '12fps', {//帧率为12fps
        delay: 0//延时播放
      });

      // 启动背景循环滚动 此处使用两个背景精灵进行走马灯轮播处理
      //运动辅助，获取一个精灵，使用to方法（类似于jQuery的animate)使精灵运动到某一状态，第二个参数是缓动函数
      Math.tween.get(bgsprite1).to({ x: -1081 }, 6000, Math.tween.Linear, true);
      Math.tween.get(bgsprite2).to({ x: 0 }, 6000, Math.tween.Linear, true);

      //创建太阳精灵
      var sun = new SNAnimation.DisplayObject({
        x: 330,//精灵的x坐标
        y: 20,//y坐标
        width: 22,//精灵图片上一个单位精灵的原始宽
        height: 22,//精灵图片上一个单位精灵的原始高
        drawWidth: 18,//实际绘制宽度
        drawHeight: 18,//实际绘制高度 比如可以缩放绘制 通过这两个属性结合Math.tween.get().to可以做到放大缩小等动画
        removeWhenEnd: false,//是否动画执行完毕后自动移除
        backgroundImage: 'gifsun'//精灵图片key 由 SNAnimation.ImageManager统一管理
      }).addTo(this.layer);
      //太阳不需要动作
      SNAnimation.Timer.cycle(sun, '0fpx');

      //创建飞机精灵
      let x = 180, flexx = 265;
      var plane = this.plane = new SNAnimation.DisplayObject({
        x: 180 - 300,//精灵的x坐标
        y: 50,//y坐标
        width: 108,//精灵图片上一个单位精灵的原始宽
        height: 64,//精灵图片上一个单位精灵的原始高
        drawWidth: 108,//实际绘制宽度
        drawHeight: 64,//实际绘制高度 比如可以缩放绘制 通过这两个属性结合Math.tween.get().to可以做到放大缩小等动画
        removeWhenEnd: false,//是否动画执行完毕后自动移除
        backgroundImage: 'gifplane'//精灵图片key 由 SNAnimation.ImageManager统一管理
      }).addTo(this.layer);
      //飞机不需要动画，飞机扇叶需要动画而已
      SNAnimation.Timer.cycle(plane, '0fpx');

      //创建飞机风扇叶片
      var flex = this.flex = new SNAnimation.DisplayObject({
        x: 265 - 300,//精灵的x坐标
        y: 50,//y坐标
        width: 17,//精灵图片上一个单位精灵的原始宽
        height: 64,//精灵图片上一个单位精灵的原始高
        drawWidth: 17,//实际绘制宽度
        drawHeight: 64,//实际绘制高度 比如可以缩放绘制 通过这两个属性结合Math.tween.get().to可以做到放大缩小等动画
        removeWhenEnd: false,//是否动画执行完毕后自动移除
        horizontal: false,//横向或纵向播放精灵图片上的单位精灵
        backgroundImage: 'gifflex'//精灵图片key 由 SNAnimation.ImageManager统一管理
      }).addTo(this.layer);
      //创建风扇旋转动画
      SNAnimation.Timer.cycle(flex, '24fpx', {//帧率为12fps
        from: 0,//精灵图上起始单位精灵索引 比如从第二张精灵单位开始播放
        to: 3,//精灵图上结束单位精灵索引，比如到第五张精灵单位结束播放
        loop: -1,//循环次数，播放时间长度则由循环次数与帧率共同决定
        delay: 0//延时播放
      });
      Math.tween.get(plane).to({ x }, 1000, Math.tween.Quad.easeInOut);
      Math.tween.get(flex).to({ x: flexx }, 1000, Math.tween.Quad.easeInOut);

      //创建云层精灵
      var cloud1 = new SNAnimation.DisplayObject({
        width: 1081,//精灵图片上一个单位精灵的原始宽
        height: 145,//精灵图片上一个单位精灵的原始高
        drawWidth: 1081,//实际绘制宽度
        drawHeight: 145,//实际绘制高度 比如可以缩放绘制 通过这两个属性结合Math.tween.get().to可以做到放大缩小等动画
        opacity: .8,
        removeWhenEnd: false,//是否动画执行完毕后自动移除
        backgroundImage: 'gifyun'//精灵图片key 由 SNAnimation.ImageManager统一管理
      }).addTo(this.layer);
      //云层动画
      SNAnimation.Timer.cycle(cloud1, '12fps', {//帧率为12fps
        delay: 0//延时播放
      });

      //创建云层精灵
      var cloud2 = new SNAnimation.DisplayObject({
        x: 1075,//精灵的x坐标
        width: 1081,//精灵图片上一个单位精灵的原始宽
        height: 145,//精灵图片上一个单位精灵的原始高
        drawWidth: 1081,//实际绘制宽度
        drawHeight: 145,//实际绘制高度 比如可以缩放绘制 通过这两个属性结合Math.tween.get().to可以做到放大缩小等动画
        opacity: .8,
        removeWhenEnd: false,//是否动画执行完毕后自动移除
        backgroundImage: 'gifyun'//精灵图片key 由 SNAnimation.ImageManager统一管理
      }).addTo(this.layer);
      //云层动画
      SNAnimation.Timer.cycle(cloud1, '12fps', {//帧率为12fps
        delay: 0//延时播放
      });
      //云层动画
      SNAnimation.Timer.cycle(cloud2, '12fps', {//帧率为12fps
        delay: 0//延时播放
      });

      // 启动云层循环滚动 此处使用两个云层精灵进行走马灯轮播处理
      //运动辅助，获取一个精灵，使用to方法（类似于jQuery的animate)使精灵运动到某一状态，第二个参数是缓动函数
      Math.tween.get(cloud1).to({ x: -1081 }, 8000, Math.tween.Linear, true);
      Math.tween.get(cloud2).to({ x: 0 }, 8000, Math.tween.Linear, true);

      this.layer.start();
      SNAnimation.Renderer.addLayer(this.layer);
    }
  },
  
  ani_zhuang2:{
      layer:null,
      remove:function(){
          this.layer && this.layer.remove();
      },
      run:function(x = 180,y = 0){
          this.layer && this.layer.remove();//若存在，首先移除
          this.layer = new SNAnimation.Layer({
              width,
              height,
              autorender:true,
              autostart:false
          });
          var sprite2 = new SNAnimation.DisplayObject({
              x:x,
              y:y,
              top:0,
              width:170,
              height:160,
              drawWidth:170,
              drawHeight:160,
              removeWhenEnd:false,
              backgroundImage:'zhuang_2',
              onComplete:function(){
                 setTimeout(function(){
                      sprite2.remove();
                  },900);
              }
          }).addTo(this.layer);
          SNAnimation.Timer.cycle(sprite2,'20fps',{
              from:0,
              to:11,
              loop:1,
              delay:0
          });
          this.layer.start();
          setTimeout(function(){
              Math.tween.get(sprite2).to({drawWidth:10,drawHeight:10},500,Math.tween.Cubic.easeIn);
          },1000);
          SNAnimation.Renderer.addLayer(this.layer);
      }
  },
  /**
   * 开始动画
   */
  ani_start:{
      layer:null,
      remove:function(){
          this.layer && this.layer.remove();
      },
      run:function(x = 100,y = 50){
          this.layer && this.layer.remove();//若存在，首先移除
          this.layer = new SNAnimation.Layer({
              width,
              height,
              autorender:true,
              autostart:false
          });
          var sprite1 = new SNAnimation.DisplayObject({
              x:x,
              y:y,
              top:0,
              width:302,
              height:91,
              drawWidth:201,
              drawHeight:60,
              originX:100,
              originY:30,
              blend:'source-over',
              removeWhenEnd:true,
              backgroundImage:'kaishi_2'
          }).addTo(this.layer);
          SNAnimation.Timer.cycle(sprite1,'1fps',{
              from:0,
              to:0,
              loop:1,
              delay:0
          });
          var sprite2 = new SNAnimation.DisplayObject({
              x:x,
              y:y,
              top:0,
              width:152,
              height:80,
              drawWidth:101,
              drawHeight:53,
              originX:50,
              originY:27,
              removeWhenEnd:true,
              backgroundImage:'kaishi_1',
              onComplete:function(){
              }
          }).addTo(this.layer);
          SNAnimation.Timer.cycle(sprite2,'1fps',{
              from:0,
              to:0,
              loop:1,
              delay:0
          });
          Math.tween.get(sprite1).to({x:x+150},200,Math.tween.Cubic.easeIn);
          Math.tween.get(sprite2).to({x:x+150},500,Math.tween.Back.easeOut);

          this.layer.start();
          SNAnimation.Renderer.addLayer(this.layer);
      }
  },
  /**
   * 复杂飞机动画
   */
  ani_plane3:{
      layer:null,
      remove:function(){
          this.layer && this.layer.remove();
      },
      run:function(x,y){
          this.layer && this.layer.remove();//若存在，首先移除
          var sprite1DrawWidth = 10,sprite1DrawHeight = 6.25,sprite2DrawWidth = 30,sprite2DrawHeight = 12.5;
          this.layer = new SNAnimation.Layer({
              width,
              height,
              autorender:true,
              autostart:false
          });
          var sprite1 = new SNAnimation.DisplayObject({
              x:x+50,
              y:y+5,
              top:0,
              width:160,
              height:100,
              drawWidth:sprite1DrawWidth,
              drawHeight:sprite1DrawHeight,
              removeWhenEnd:true,
              backgroundImage:'yanwu'
          }).addTo(this.layer);
          SNAnimation.Timer.cycle(sprite1,'16fps',{
              from:0,
              to:7,
              loop:4,
              delay:0
          });
          var sprite2 = new SNAnimation.DisplayObject({
              x:x,
              y:y,
              top:0,
              width:240,
              height:100,
              drawWidth:sprite2DrawWidth,
              drawHeight:sprite2DrawHeight,
              removeWhenEnd:true,
              backgroundImage:'feiji(3)'
          }).addTo(this.layer);
          SNAnimation.Timer.cycle(sprite2,'2fps',{
              from:0,
              to:0,
              loop:4,
              delay:0
          });
          Math.tween.get(sprite1).to({x:x+150,
              drawWidth:30*sprite1DrawWidth,
              drawHeight:30*sprite1DrawHeight},2000,Math.tween.Cubic.easeIn);
          Math.tween.get(sprite2).to({
              drawWidth:30*sprite2DrawWidth,
              drawHeight:30*sprite2DrawHeight},2000,Math.tween.Cubic.easeIn);
          setTimeout(function(){
              Math.tween.get(sprite1).to({opacity:0},250,Math.tween.Cubic.easeIn);
              Math.tween.get(sprite2).to({opacity:0},400,Math.tween.Cubic.easeIn);
          },1300);
          this.layer.start();

          SNAnimation.Renderer.addLayer(this.layer);
      }
  },
  /**
   * 普通飞机1动画
   */
  ani_plane1:{
      layer:null,
      remove:function(){
          this.layer && this.layer.remove();
      },
      run:function(x,y){
          this.layer && this.layer.remove();//若存在，首先移除
          this.layer = new SNAnimation.Layer({
              width,
              height,
              autorender:true,
              autostart:false
          });
          var sprite1 = new SNAnimation.DisplayObject({
              x:x,
              y:y,
              top:0,
              width:160,
              height:90,
              drawWidth:160,
              drawHeight:90,
              originX:0,
              originY:0,
              removeWhenEnd:true,
              horizontal:false,
              backgroundImage:'feiji_1',
              onComplete:function(){

              }
          }).addTo(this.layer);
          SNAnimation.Timer.cycle(sprite1,'12fps',{
              from:0,
              to:1,
              loop:12,
              delay:0
          });

          this.layer.start();

          Math.tween.get(sprite1).to({x:width+320},3000,Math.tween.Sine.easeInOut);
          SNAnimation.Renderer.addLayer(this.layer);
      }
  },
  /**
   * 普通飞机2动画
   */
  ani_plane2:{
      layer:null,
      remove:function(){
          this.layer && this.layer.remove();
      },
      run:function(x,y){
          this.layer && this.layer.remove();//若存在，首先移除
          this.layer = new SNAnimation.Layer({
              width,
              height,
              autorender:true,
              autostart:false
          });
          var sprite1 = new SNAnimation.DisplayObject({
              x:x,
              y:y,
              top:0,
              width:338,
              height:90,
              drawWidth:338,
              drawHeight:90,
              originX:0,
              originY:0,
              removeWhenEnd:true,
              horizontal:false,
              backgroundImage:'feiji(2)'
          }).addTo(this.layer);

          this.layer.start();
          Math.tween.get(sprite1).to({x:-500},3000,Math.tween.Linear);

          SNAnimation.Renderer.addLayer(this.layer);
      }
  },
  ani_beauity:{
      layer:null,
      remove:function(){
          this.layer && this.layer.remove();
      },
      run:function(x,y){
          this.layer && this.layer.remove();//若存在，首先移除
          //创建一个装载精灵的图层
          this.layer = new SNAnimation.Layer({
              width,//图层宽 目前没有用到
              height,//图层高 目前没有用到
              autorender:true,//是否自动渲染，如果是，初始化好之后便会出现在屏幕上，否则调用start方法之后才会开始渲染
              autostart:false//是否自动开始精灵动画（此精灵动画指的是循环切换图片上的小精灵）
          });
          //创建一个精灵
          var sprite1 = new SNAnimation.DisplayObject({
              x:x,//精灵的x坐标
              y:y,//y坐标
              top:150,//精灵图片的top偏移 还有一个属性left
              width:120,//精灵图片上一个单位精灵的原始宽
              height:150,//精灵图片上一个单位精灵的原始高
              drawWidth:120,//实际绘制宽度
              drawHeight:150,//实际绘制高度 比如可以缩放绘制 通过这两个属性结合Math.tween.get().to可以做到放大缩小等动画
              originX:0,//X轴偏移修正
              originY:0,//Y轴偏移修正
              removeWhenEnd:true,//是否动画执行完毕后自动移除
              horizontal:true,//横向或纵向播放精灵图片上的单位精灵
              backgroundImage:'sailormars'//精灵图片key 由 SNAnimation.ImageManager统一管理
          }).addTo(this.layer);
          //创建一个动画
          SNAnimation.Timer.cycle(sprite1,'12fps',{//帧率为12fps
              from:0,//精灵图上起始单位精灵索引 比如从第二张精灵单位开始播放
              to:5,//精灵图上结束单位精灵索引，比如到第五张精灵单位结束播放
              loop:10000,//循环次数，播放时间长度则由循环次数与帧率共同决定
              delay:0//延时播放
          });

          
          //创建一个精灵
          var sprite2 = new SNAnimation.DisplayObject({
            x:x+120,//精灵的x坐标
            y:y,//y坐标
            top:0,//精灵图片的top偏移 还有一个属性left
            width:120,//精灵图片上一个单位精灵的原始宽
            height:150,//精灵图片上一个单位精灵的原始高
            drawWidth:120,//实际绘制宽度
            drawHeight:150,//实际绘制高度 比如可以缩放绘制 通过这两个属性结合Math.tween.get().to可以做到放大缩小等动画
            originX:0,//X轴偏移修正
            originY:0,//Y轴偏移修正
            removeWhenEnd:true,//是否动画执行完毕后自动移除
            horizontal:true,//横向或纵向播放精灵图片上的单位精灵
            backgroundImage:'sailormars'//精灵图片key 由 SNAnimation.ImageManager统一管理
          }).addTo(this.layer);
          //创建一个动画
          SNAnimation.Timer.cycle(sprite2,'12fps',{//帧率为12fps
              from:0,//精灵图上起始单位精灵索引 比如从第二张精灵单位开始播放
              to:7,//精灵图上结束单位精灵索引，比如到第五张精灵单位结束播放
              loop:10000,//循环次数，播放时间长度则由循环次数与帧率共同决定
              delay:0//延时播放
          });

          //创建一个精灵
          var sprite3 = new SNAnimation.DisplayObject({
            x:x+270,//精灵的x坐标
            y:y,//y坐标
            top:300,//精灵图片的top偏移 还有一个属性left
            width:120,//精灵图片上一个单位精灵的原始宽
            height:150,//精灵图片上一个单位精灵的原始高
            drawWidth:120,//实际绘制宽度
            drawHeight:150,//实际绘制高度 比如可以缩放绘制 通过这两个属性结合Math.tween.get().to可以做到放大缩小等动画
            originX:0,//X轴偏移修正
            originY:0,//Y轴偏移修正
            removeWhenEnd:true,//是否动画执行完毕后自动移除
            horizontal:true,//横向或纵向播放精灵图片上的单位精灵
            backgroundImage:'sailormars'//精灵图片key 由 SNAnimation.ImageManager统一管理
          }).addTo(this.layer);
          //创建一个动画
          SNAnimation.Timer.cycle(sprite3,'12fps',{//帧率为12fps
              from:0,//精灵图上起始单位精灵索引 比如从第二张精灵单位开始播放
              to:9,//精灵图上结束单位精灵索引，比如到第五张精灵单位结束播放
              loop:10000,//循环次数，播放时间长度则由循环次数与帧率共同决定
              delay:0//延时播放
          });

          
          //创建一个精灵
          var sprite4 = new SNAnimation.DisplayObject({
            x:x+420,//精灵的x坐标
            y:y,//y坐标
            top:450,//精灵图片的top偏移 还有一个属性left
            width:120,//精灵图片上一个单位精灵的原始宽
            height:150,//精灵图片上一个单位精灵的原始高
            drawWidth:120,//实际绘制宽度
            drawHeight:150,//实际绘制高度 比如可以缩放绘制 通过这两个属性结合Math.tween.get().to可以做到放大缩小等动画
            originX:0,//X轴偏移修正
            originY:0,//Y轴偏移修正
            removeWhenEnd:true,//是否动画执行完毕后自动移除
            horizontal:true,//横向或纵向播放精灵图片上的单位精灵
            backgroundImage:'sailormars'//精灵图片key 由 SNAnimation.ImageManager统一管理
          }).addTo(this.layer);
          //创建一个动画
          SNAnimation.Timer.cycle(sprite4,'12fps',{//帧率为12fps
              from:0,//精灵图上起始单位精灵索引 比如从第二张精灵单位开始播放
              to:8,//精灵图上结束单位精灵索引，比如到第五张精灵单位结束播放
              loop:10000,//循环次数，播放时间长度则由循环次数与帧率共同决定
              delay:0//延时播放
          });

          this.layer.start();
          //运动辅助，获取一个精灵，使用to方法（类似于jQuery的animate)使精灵运动到某一状态，第二个参数是缓动函数
          Math.tween.get(sprite1).to({x:200},1500,Math.tween.Linear).to({x:600},1500,Math.tween.Linear);
          //可以运动过程中动态调整fps
          setTimeout(function(){
              sprite1.setFps('15fps');
          },1500);
          SNAnimation.Renderer.addLayer(this.layer);
      }
  },
  ani_win:{
      layer:null,
      remove:function(){
          this.layer && this.layer.remove();
      },
      run:function(x,y){
          this.layer && this.layer.remove();//若存在，首先移除
          this.layer = new SNAnimation.Layer({
              width,
              height,
              autorender:true,
              autostart:false
          });
          var width1 = width/2,height1 = width1;
          var sprite1 = new SNAnimation.DisplayObject({
              x:x,
              y:y,
              top:0,
              width:500,
              height:500,
              drawWidth:width1,
              drawHeight:height1,
              rotate:0,
              removeWhenEnd:false,
              backgroundImage:'winback',
              onComplete:function(){
              }
          }).addTo(this.layer);
          SNAnimation.Timer.cycle(sprite1,'10fps',{
              from:0,
              to:0,
              loop:35,
              delay:0
          });
          var width2 = width/5,height2 = width2*84/164;
          var sprite2 = new SNAnimation.DisplayObject({
              x:x+160,
              y:y+200,
              top:0,
              width:164,
              height:84,
              drawWidth:width2,
              drawHeight:height2,
              removeWhenEnd:false,
              backgroundImage:'win',
              onComplete:function(){
              }
          }).addTo(this.layer);
          SNAnimation.Timer.cycle(sprite2,'10fps',{
              from:0,
              to:0,
              loop:35,
              delay:0
          });
          this.layer.start();
          Math.tween.get(sprite1).to({rotate:100,drawWidth:width1*1.3,drawHeight:height1*1.3,opacity:.5},1200,Math.tween.Back.easeOut).
              to({rotate:150,drawWidth:width1,drawHeight:height1,opacity:1},1500,Math.tween.Linear);
          Math.tween.get(sprite2).to({rotate:-5,drawWidth:width2*3,drawHeight:height2*3,opacity:.8},300,Math.tween.Back.easeOut).
          to({rotate:5,drawWidth:width2*.8,drawHeight:height2*.8,opacity:1},300,Math.tween.Back.easeOut).
          to({rotate:0,drawWidth:width2*1.5,drawHeight:height2*1.5,opacity:1},300,Math.tween.Back.easeOut).
          to({rotate:0,drawWidth:width2*1,drawHeight:height2*1,opacity:.8},300,Math.tween.Back.easeOut);
          SNAnimation.Renderer.addLayer(this.layer);
      }
  },
  ani_lose:{
      layer:null,
      remove:function(){
          this.layer && this.layer.remove();
      },
      run:function(x,y){
          this.layer && this.layer.remove();//若存在，首先移除
          this.layer = new SNAnimation.Layer({
              width,
              height,
              autorender:true,
              autostart:false
          });
          var width1 = width/2,height1 = width1*151/375;
          var sprite1 = new SNAnimation.DisplayObject({
              x:x,
              y:y+80,
              top:0,
              width:375,
              height:151,
              drawWidth:width1,
              drawHeight:height1,
              rotate:0,
              removeWhenEnd:false,
              backgroundImage:'loseback',
              onComplete:function(){
              }
          }).addTo(this.layer);
          SNAnimation.Timer.cycle(sprite1,'10fps',{
              from:0,
              to:0,
              loop:20,
              delay:0
          });
          var width2 = width/5,height2 = width2*91/160;
          var sprite2 = new SNAnimation.DisplayObject({
              x:x+80,
              y:y+80,
              top:0,
              width:160,
              height:91,
              drawWidth:width2,
              drawHeight:height2,
              removeWhenEnd:false,
              backgroundImage:'lose',
              onComplete:function(){
              }
          }).addTo(this.layer);
          SNAnimation.Timer.cycle(sprite2,'10fps',{
              from:0,
              to:0,
              loop:20,
              delay:0
          });
          this.layer.start();
          Math.tween.get(sprite1).to({drawWidth:width1*1.2,drawHeight:height1*1.2,opacity:.5},500,Math.tween.Back.easeOut).
          to({drawWidth:width1,drawHeight:height1,opacity:1},500,Math.tween.Linear);
          Math.tween.get(sprite2).to({rotate:5,y:y+80+50,drawWidth:width2*3,drawHeight:height2*3,opacity:.8},300,Math.tween.Back.easeOut).
          to({rotate:-5,y:y+80,drawWidth:width2*.7,drawHeight:height2*.7,opacity:1},300,Math.tween.Back.easeOut).
          to({rotate:0,y:y+80,drawWidth:width2*1,drawHeight:height2*1,opacity:1},300,Math.tween.Back.easeOut);
          SNAnimation.Renderer.addLayer(this.layer);
      }
  },
};

export default Animations;






