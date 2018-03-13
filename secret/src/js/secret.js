$(function() {
    var secret =  {
        init:function() {
            secret.hideBanner()
            secret.tab()
        },

        hideBanner: function() {
            setInterval(function() {
                $('.banner').slideUp(300)
            },10000)
        },

        // 个人中心tab切换
        tab: function() {
            var $navLists = $('.tab-nav').find('.nav-list');
            var $navContents = $('.info-tab-content');

            $navLists.each(function(idx) {
                $(this).on('touchend', function() {

                    $(this).addClass('on').siblings().removeClass('on')
                    
                    $navContents.each(function() {
                        $(this).addClass('hide')
                    })

                    $navContents.eq(idx).removeClass('hide')

                })
            })

        }
        


    }
    
    secret.init()
})