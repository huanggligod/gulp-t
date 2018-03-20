(function(global, $, doc) {
    'use strict'
    
    var liveLow = function() {
        this.initializeElements();
        this.bindEvent();
    };
    liveLow.Eles = {
        swiperContainer: '.swiper-container',
        swiperWrapper: '.swiper-wrapper',
        swiperSlide: '.swiper-slide'
    };

    liveLow.prototype = {
        constructor: liveLow,
        bindEvent: function() {
            this.mySwiper();
        },
        // 绑定选择器
        initializeElements: function() {
            var eles = liveLow.Eles;
            for(var name in eles) {
                if(eles.hasOwnProperty(name)) {
                    this[name] = $(eles[name])
                }
            }
        },

        mySwiper: function() { 
            var swiper = new Swiper(this.swiperContainer,{
                autoplay: true,
                loop: true,
                speed: 1000
            })
        } 
    }

    global.liveLow = liveLow

    $(function() {
        new liveLow()
    })

})(window,jQuery, document, undefined)