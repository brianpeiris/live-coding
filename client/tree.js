var
  utils = _.require("lib/utils"), 
  rand = Math.random,
  Scene = _.def({
    init: function () {
      this.width = 640;
      this.height = 480;

      this.id = _.uniqueId();

      this.canvas = $(
        '<canvas width="' + this.width +
        '" height="' + this.height + '"></canvas>'
      );

      this.ctx = this.canvas[0].getContext("2d");
      $(".canvas").empty().append(this.canvas);
    },

    run: function () {
      this.step();
    },

    _drawLeaf: function (cx, xx, yy) {
      var
        leafAlpha = 8/10,
        leafJiggle = 2,
        leafSize = 7;

      cx.beginPath();
      cx.fillStyle = (
        "rgba(" + 
        Math.round(220 + (rand() * 50)) + ", " + 
        Math.round(184 + (rand() * 50)) + ", " + 
        Math.round(235 + (rand() * 50)) + ", " + 
        leafAlpha + 
        ")"
      );  
      cx.arc(
        xx + (rand() - 0.5) * leafJiggle, 
        yy + (rand() - 0.5) * leafJiggle, 
        leafSize, 
        0, Math.PI * 2
      );
      cx.fill();
    },

    _drawBranch: function (cx, xx, yy, level, levels, angle) {
      var
        branchSeedTweak = 3,
        ii, numBranches = 5,
        branchTweaks = [],
        subBranchWidthFactor = 2,
        newXX, newYY,
        tt,
        sweep = Math.PI * 25/30,
        branchTweakMagnitude = 52/50,
        branchLength = 44;

      Math.seedrandom("branchSeed" + level + branchSeedTweak);
      
      for (ii = 0; ii < numBranches; ii++) {
        branchTweaks.push(Math.random() - 0.5);
      }

      for (ii = 0; ii < numBranches; ii++) {
        cx.beginPath();
        cx.lineWidth = (levels - level) * subBranchWidthFactor;
        tt = (
          sweep * ii / (numBranches - 1) + angle -
          sweep / 2 + Math.PI + 
          (branchTweaks[ii] * branchTweakMagnitude)
        );
        
        cx.moveTo(xx, yy);
        newXX = xx + Math.sin(tt) * branchLength;
        newYY = yy + Math.cos(tt) * branchLength;
        cx.lineTo(newXX, newYY);
        cx.stroke();
        
        this._drawBranchesAndLeaves(cx, newXX, newYY, level + 1, levels, Math.PI + tt);
      }
    },
    
    _drawBranchesAndLeaves: function (cx, xx, yy, level, levels, angle) {
      if (level === levels) { 
        this._drawLeaf(cx, xx, yy);
      }
      else {
        this._drawBranch(cx, xx, yy, level, levels, angle);
      }
    },
    
    _drawTree: function(cx, ww, hh) {
      var trunkX = ww / 2, trunkY = hh - 165;
      
      cx.strokeStyle = "rgb(" + 0 + ", " + 0 + ", " + 0 + ")";
      cx.lineWidth = 13;
      cx.lineCap = "round";
      
      cx.moveTo(trunkX, hh);
      cx.lineTo(trunkX, trunkY);
      cx.stroke();
      
      this._drawBranchesAndLeaves(cx, trunkX, trunkY, 0, 3, 0);
    },

    step: function () {
      if(this._stopped) { return; }
      
      utils.nextFrame(_.bind(this.step, this));
      
      this.canvas[0].width = this.width;
      
      this._drawTree(this.ctx, this.width, this.height);
    },

    stop: function () {
      this._stopped = true;
      this.canvas.remove();
    }
  }),
  exports;

// Math.seedrandom
(function(j,i,g,m,k,n,o){function q(b){var e,f,a=this,c=b.length,d=0,h=a.i=a.j=a.m=0;a.S=[];a.c=[];for(c||(b=[c++]);d<g;)a.S[d]=d++;for(d=0;d<g;d++)e=a.S[d],h=h+e+b[d%c]&g-1,f=a.S[h],a.S[d]=f,a.S[h]=e;a.g=function(b){var c=a.S,d=a.i+1&g-1,e=c[d],f=a.j+e&g-1,h=c[f];c[d]=h;c[f]=e;for(var i=c[e+h&g-1];--b;)d=d+1&g-1,e=c[d],f=f+e&g-1,h=c[f],c[d]=h,c[f]=e,i=i*g+c[e+h&g-1];a.i=d;a.j=f;return i};a.g(g)}function p(b,e,f,a,c){f=[];c=typeof b;if(e&&c=="object")for(a in b)if(a.indexOf("S")<5)try{f.push(p(b[a],e-1))}catch(d){}return f.length?f:b+(c!="string"?"\0":"")}function l(b,e,f,a){b+="";for(a=f=0;a<b.length;a++){var c=e,d=a&g-1,h=(f^=e[a&g-1]*19)+b.charCodeAt(a);c[d]=h&g-1}b="";for(a in e)b+=String.fromCharCode(e[a]);return b}i.seedrandom=function(b,e){var f=[],a;b=l(p(e?[b,j]:arguments.length?b:[(new Date).getTime(),j,window],3),f);a=new q(f);l(a.S,j);i.random=function(){for(var c=a.g(m),d=o,b=0;c<k;)c=(c+b)*g,d*=g,b=a.g(1);for(;c>=n;)c/=2,d/=2,b>>>=1;return(c+b)/d};return b};o=i.pow(g,m);k=i.pow(2,k);n=k*2;l(i.random(),j)})([],Math,256,6,52);

exports = new Scene();


