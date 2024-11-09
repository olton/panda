class App {
    currentPage = "";

    constructor() {
        const hash = location.hash;
        const target = hash.length > 0 ? hash.substring(1) : "welcome";

        this.sidebar = $("#side-menu");
        this.content = $("#page-content");
        this.currentPage = target
        this.loadPage().then(() => {})
        this.eventHandler()
        this.initSidebar()
    }

    initSidebar(){
        this.sidebar.find(".active").removeClass("active");

        const anchor = this.sidebar.find(`a[href='#${this.currentPage}']`)
        const link = anchor.parent()
        const parent_menu = anchor.closest("ul[data-role=collapse]")
        link.addClass("active");
        if (parent_menu.length > 0) {
            Metro.getPlugin(parent_menu, "collapse").expand(true);
        }
    }

    async loadPage(){
        const component = `/pages/${this.currentPage}/index.html`;
        const content = await fetch(component).then(response => response.text());
        this.content.html(content);
        if (window["PAGE_TITLE"]) {
            this.setPageTitle(window["PAGE_TITLE"]);
        }
        Metro.utils.cleanPreCode("pre code");
        hljs.highlightAll();
    }

    eventHandler(){
        const that = this;
        this.sidebar.on('click', 'a', function(e) {
            const anchor = $(this);
            const href = anchor.attr('href');
            const li = anchor.parent();

            if (href.startsWith("#")) {
                that.sidebar.find(".active").removeClass("active");
                li.addClass("active");
                that.currentPage = href.substring(1);
                that.loadPage().then(() => {});
                window.history.pushState(null, null, "/#"+that.currentPage);
                e.preventDefault();
                e.stopPropagation();
            } else {
                window.location.href = href;
            }
        })

        $(window).on('popstate', function() {
            that.currentPage = location.hash.substring(1);
            that.loadPage().then(() => {});
        })
    }

    setPageTitle(title){
        $("title").html(`${title} - Pandora 2.0 The theme set built with Metro UI`);
        $("#page-title").html(title);
        $("#content-title").html(title);
    }
}

$(function(){
    new App();
})

