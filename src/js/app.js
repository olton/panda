class App {
    static intervals = [];

    constructor() {
        const {pathname: path = 'welcome', hash} = location;

        this.sidebar = $("#side-menu");
        this.content = $("#page-content");
        this.location = {path: path === "/" ? "welcome" : path.substring(1), hash}
        
        this.loadPage().then(() => {})
        this.eventHandler()
        this.initSidebar()
    }

    initSidebar(){
        this.sidebar.find(".active").removeClass("active");

        const anchor = this.sidebar.find(`a[href='/${this.location.path}']`)
        const link = anchor.parent()
        const parent_menu = anchor.closest("ul[data-role=collapse]")
        link.addClass("active");
        if (parent_menu.length > 0) {
            Metro.getPlugin(parent_menu, "collapse").expand(true);
        }
    }

    async loadPage(){
        for(let interval of App.intervals) {
            clearInterval(interval);
        }

        let component = `/pages/${this.location.path}/index.html`;
        let content = await fetch(component).then(response => response.text())


        if (content.includes("<!-- root -->")) {
            component = `/pages/under-construction/index.html`;
            content = await fetch(component).then(response => response.text());
        }

        this.content.html(content);
        
        if (this.location.hash) {
            const scrollToEl = $(this.location.hash)
            if (scrollToEl.length > 0) {
                scrollToEl[0].scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
            }
        }

        if (window["PAGE_TITLE"]) {
            this.setPageTitle(window["PAGE_TITLE"]);
        }

        Metro.utils.cleanPreCode("pre code");

        hljs.highlightAll();

        $("pre").each((i, el) => {
            const btn = $("<button>").addClass("button square small copy-code-button").html("<span class='mif-copy'>");
            $(el).append(btn);
        })

        const showCode = Metro.storage.getItem("panda:showCode", false);
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

            if (href.startsWith("http")) {
                window.location.href = href;
                return;
            }
            
            $("#side-menu .active").removeClass("active");
            li.addClass("active");
            
            window.history.pushState(null, null, href);
            const [path, hash = ''] = href.split("#");
            that.location = {path: path.substring(1), hash};
            that.loadPage().then(() => {});
            e.preventDefault();
        })

        $(window).on('popstate', function(e) {
            const {pathname: path = 'welcome', hash} = location;
            that.location = {path: path === "/" ? "welcome" : path.substring(1), hash}
            that.loadPage().then(() => {});
        })

        $("#showCodeToggle").on("click", function(e) {
            const checked = this.checked;
            if (checked) {
                $("html").addClass("show-code");
            } else {
                $("html").removeClass("show-code");
            }
            Metro.storage.setItem("panda:showCode", checked);
        })

        $("document").on("click", ".copy-code-button", function() {
            const code = $(this).siblings("code").text();
            Metro.utils.copy2clipboard(code);
            Metro.toast.create("Code copied to clipboard!", {})
        })
    }

    setPageTitle(title){
        $("title").html(`${title} - The template set built with Metro UI`);
        $("#page-title").html(title);
        $("#content-title").html(title);
    }
}

globalThis.App = App;

$(function(){
    new App();
})

