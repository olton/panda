// globalThis.handlers = {
//     intervals: [],
// }
//
class App {
    static intervals = [];

    page = "";

    constructor() {
        const hash = location.hash;
        const target = hash.length > 0 ? hash.substring(1) : "welcome";

        this.sidebar = $("#side-menu");
        this.content = $("#page-content");
        this.page = target
        this.loadPage().then(() => {})
        this.eventHandler()
        this.initSidebar()
    }

    initSidebar(){
        this.sidebar.find(".active").removeClass("active");

        const anchor = this.sidebar.find(`a[href='#${this.page}']`)
        const link = anchor.parent()
        const parent_menu = anchor.closest("ul[data-role=collapse]")
        link.addClass("active");
        if (parent_menu.length > 0) {
            Metro.getPlugin(parent_menu, "collapse").expand(true);
        }
    }

    async loadPage(){
        const component = `/pages/${this.page}/index.html`;
        const content = await fetch(component).then(response => response.text()).catch(e => 'error');
        
        for(let interval of App.intervals) {
            clearInterval(interval);
        }
        
        this.content.html(content);
        if (window["PAGE_TITLE"]) {
            this.setPageTitle(window["PAGE_TITLE"]);
        }
        Metro.utils.cleanPreCode("pre code");

        hljs.highlightAll();

        $("pre").each((i, el) => {
            const btn = $("<button>").addClass("button square small copy-code-button").html("<span class='mif-copy'>");
            $(el).append(btn);
        })

        const showCode = Metro.storage.getItem("pandora:showCode", false);
        if (showCode) {
            $("html").addClass("show-code");
            $("#showCodeToggle").attr("checked", true);
        }
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
                that.page = href.substring(1);
                that.loadPage().then(() => {});
                window.history.pushState(null, null, "/#"+that.page);
                e.preventDefault();
                e.stopPropagation();
            } else {
                window.location.href = href;
            }
        })

        $(window).on('popstate', function(e) {  
            that.page = location.hash.substring(1);
            that.loadPage().then(() => {});
        })

        $("#showCodeToggle").on("click", function(e) {
            const checked = this.checked;
            if (checked) {
                $("html").addClass("show-code");
            } else {
                $("html").removeClass("show-code");
            }
            Metro.storage.setItem("pandora:showCode", checked);
        })

        $("document").on("click", ".copy-code-button", function() {
            const code = $(this).siblings("code").text();
            Metro.utils.copy2clipboard(code);
            Metro.toast.create("Code copied to clipboard!", {})
        })
    }

    setPageTitle(title){
        $("title").html(`${title} - Pandora 2.0 The theme set built with Metro UI`);
        $("#page-title").html(title);
        $("#content-title").html(title);
    }
}

globalThis.App = App;

$(function(){
    new App();
})

