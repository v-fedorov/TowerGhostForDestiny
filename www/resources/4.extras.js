tgd.Tooltip = function(id) {
    var self = this;

    var info = _itemDefs[id];
    this.class = "destt-q" + info.tierType;
    this.icon = tgd.tooltipsIconTemplate({
        item: info
    });
    this.id = id;
    this.name = unescape(info.itemName);
    this.site = "destinydb";
    this.tooltip = tgd.tooltipsTemplate({
        item: info
    });
    this.type = "items";
};

var $ZamTooltips = function() {
    this.addIcons = false;
    this.renameLinks = false;
    this.colorLinks = false;
    this.isEnabled = true;
    this.enabled = function() {
        return this.isEnabled;
    };
    this.renderCallback = function(context, content, element, cb) {
        cb(content);
    };
    if (typeof zam_tooltips == 'object') {
        if (zam_tooltips.addIcons) {
            this.addIcons = true;
        }
        if (zam_tooltips.renderCallback) {
            this.renderCallback = zam_tooltips.renderCallback;
        }
        if (zam_tooltips.renameLinks) {
            this.renameLinks = true;
        }
        if (zam_tooltips.colorLinks) {
            this.colorLinks = true;
        }
        if ("isEnabled" in zam_tooltips) {
            this.isEnabled = zam_tooltips.isEnabled;
        }
    }
    var remote = (typeof FH == 'undefined');
    var sites = {
        d3head: {
            url: 'd3head.com',
            cdn: 'https://d3css.zamimg.com',
            tt: '<div class="fhtt d3h d3h-custom"><div class="d3htt-cont">@text@</div><div class="d3htt-right"></div><div class="d3htt-bottomright"></div><div class="d3htt-bottom"></div></div>',
            ttFluid: '<div class="fhtt d3h d3h-fluid"><div class="d3htt-cont">@text@</div><div class="d3htt-right"></div><div class="d3htt-bottomright"></div><div class="d3htt-bottom"></div></div>',
            types: ['achievement', 'class', 'crafting', 'item', 'lore', 'npc', 'quest', 'recipe', 'rune', 'skill', 'zone', 'custom']
        },
        esohead: {
            url: 'esohead.com',
            cdn: 'https://esocss.zamimg.com',
            tt: '<div class="fhtt eh"><div class="ehtt-cont">@text@</div><div class="ehtt-right"></div><div class="ehtt-bottomright"></div><div class="ehtt-bottom"></div></div>',
            ttFluid: '<div class="fhtt eh eh-fluid"><div class="ehtt-cont">@text@</div><div class="ehtt-right"></div><div class="ehtt-bottomright"></div><div class="ehtt-bottom"></div></div>',
            types: ['abilities', 'achievements', 'books', 'classes', 'items', 'itemsets', 'monsters', 'races', 'recipes', 'skills', 'tradeskills', 'zones', 'custom', 'poi', 'skyshards', 'mundus-stones']
        },
        heroking: {
            url: 'heroking.net',
            cdn: 'https://hkcss.zamimg.com',
            tt: '<div class="fhtt hk"><div class="hktt-cont">@text@</div><div class="hktt-right"></div><div class="hktt-bottomright"></div><div class="hktt-bottom"></div></div>',
            ttFluid: '<div class="fhtt hk hk-fluid"><div class="hktt-cont">@text@</div><div class="hktt-right"></div><div class="hktt-bottomright"></div><div class="hktt-bottom"></div></div>',
            types: ['heroes', 'achievements', 'abilities', 'mounts', 'talents', 'rewards', 'bundles']
        },
        destinydb: {
            url: 'destinydb.com',
            cdn: 'https://descss.zamimg.com',
            tt: '<div class="fhtt des"><div class="destt-cont">@text@</div><div class="destt-right"></div><div class="destt-bottomright"></div><div class="destt-bottom"></div></div>',
            ttFluid: '<div class="fhtt des des-fluid"><div class="destt-cont">@text@</div><div class="destt-right"></div><div class="destt-bottomright"></div><div class="destt-bottom"></div></div>',
            types: ['talents', 'talent-child', 'items', 'classes', 'races', 'activities', 'vendors', 'grimoire', 'destinations', 'places', 'medals', 'players', 'guardians', 'events', 'snapshots']
        },
        overking: {
            url: 'overking.com',
            cdn: 'https://okcss.zamimg.com',
            tt: '<div class="fhtt des"><div class="destt-cont">@text@</div><div class="destt-right"></div><div class="destt-bottomright"></div><div class="destt-bottom"></div></div>',
            ttFluid: '<div class="fhtt des des-fluid"><div class="destt-cont">@text@</div><div class="destt-right"></div><div class="destt-bottomright"></div><div class="destt-bottom"></div></div>',
            types: ['heroes', 'abilities']
        }
    };
    var reAllSites;
    var reLocalUrl;
    var cache = this.cache = {};
    var container;
    var lastEvent;
    var activeTooltip = false;
    var attachedTo = false;
    var addEvent = function(obj, evt, callback) {
        if (obj.addEventListener) {
            obj.addEventListener(evt, callback, true);
        } else {
            obj.attachEvent('on' + evt, callback);
        }
    };
    var removeEvent = function(obj, evt, callback) {
        if (obj.removeEventListener) {
            obj.removeEventListener(evt, callback, true);
        } else {
            obj.detachEvent('on' + evt, callback);
        }
    };
    var addResource = function(res) {
        if (document.head) {
            document.head.appendChild(res);
        } else {
            document.body.appendChild(res);
        }
    };
    var getCanonicalName = function(site, type, id) {
        if (!sites[site]) {
            return false;
        }
        return sites[site].url + '/' + type + '/' + id;
    };
    var getMousePos = function(event) {
        var windowInfo = getWindowInfo();
        if (!event) {
            return {
                x: -9999,
                y: -9999
            };
        }
        var x = event.pageX !== undefined ? event.pageX : windowInfo.left + event.clientX;
        var y = event.pageY !== undefined ? event.pageY : windowInfo.top + event.clientY;
        return {
            x: x,
            y: y
        };
    };
    var getElementDimensions = function(t) {
        var x = t.offsetLeft;
        var y = t.offsetTop;
        var temp = t;
        while (temp.offsetParent) {
            x += temp.offsetParent.offsetLeft;
            y += temp.offsetParent.offsetTop;
            if (temp.tagName == 'BODY') {
                break;
            }
            temp = temp.offsetParent;
        }
        return {
            x: x,
            y: y,
            w: t.offsetWidth,
            h: t.offsetHeight
        };
    };
    var getWindowInfo = function() {
        var left = typeof window.pageXOffset != 'undefined' ? window.pageXOffset : document.body.scrollLeft;
        var top = typeof window.pageYOffset != 'undefined' ? window.pageYOffset : document.body.scrollTop;
        var width = window.innerWidth ? window.innerWidth : document.body.clientWidth;
        var height = window.innerHeight ? window.innerHeight : document.body.clientHeight;
        return {
            left: left,
            top: top,
            right: left + width,
            bottom: top + height
        };
    };
    var getServerUrl = function() {
        return 'https://' + location.hostname + (location.port == 80 ? '' : ':' + location.port);
    };
    var ready = false;
    this.init = function() {
        if (ready) {
            return;
        }
        var domains = [];
        for (var s in sites) {
            if (!sites.hasOwnProperty(s)) {
                continue;
            }
            domains.push(sites[s].url);
            sites[s].typeHash = {};
            var numTypes = sites[s].types.length;
            for (var i = 0; i < numTypes; i++) {
                sites[s].typeHash[sites[s].types[i]] = true;
            }
            sites[s].re = new RegExp(sites[s].url + '/(' + sites[s].types.join('|') + ')/([^?&#;-]+)');
        }
        reAllSites = new RegExp('^https?://[^/]*\\.?(' + domains.join('|') + ')/');
        reLocalUrl = new RegExp('^(https?://)' + location.host + '(/.+)');
        addEvent(document, 'mouseover', onMouseover);
        var div = document.createElement('div');
        div.id = 'zam-tooltip';
        div.setAttribute('style', 'display:none;position:absolute;left:0;top:0;z-index:9999999999');
        try {
            document.body.insertBefore(div, document.body.childNodes[0]);
            container = div;
            ready = true;
            if (!remote || this.addIcons || this.colorLinks || this.renameLinks) {
                this.preload();
            } else if (remote) {
                this.preload(true);
            }
        } catch (e) {
            //last seen crash: Unable to get property 'insertBefore' of undefined or null reference
            ga('send', 'exception', {
                'exDescription': "tooltips crashed > " + e.toString(),
                'exFatal': false,
                'appVersion': tgd.version,
                'hitCallback': function() {
                    console.log("crash reported");
                }
            });
        }
    };
    var parseMatches = function(matches, tags) {
        var numTags = tags.length;
        for (var i = 0; i < numTags; i++) {
            var a = tags[i];
            var match = scan(a, true);
            if (match !== false) {
                if (!matches[match.site]) {
                    matches[match.site] = {};
                }
                if (!matches[match.site][match.type]) {
                    matches[match.site][match.type] = [];
                }
                if (matches[match.site][match.type].indexOf(match.id) == -1) {
                    matches[match.site][match.type].push(match.id);
                }
            }
        }
    };
    this.getContainer = function() {
        return container;
    };
    this.preload = function(cssOnly) {
        if (!ready) {
            return;
        }
        var aTags = document.body.getElementsByTagName('a');
        var dataTags = document.querySelectorAll('[data-zamtooltip]');
        var matches = {};
        parseMatches(matches, dataTags);
        parseMatches(matches, aTags);
        for (var site in matches) {
            if (!matches.hasOwnProperty(site)) {
                continue;
            }
            // loadCss(site);
            if (cssOnly) {
                continue;
            }
            for (var type in matches[site]) {
                if (type == "custom") {
                    continue;
                }
                if (!matches[site].hasOwnProperty(type)) {
                    continue;
                }
                var ids = matches[site][type];
                var finalIDs = [];
                for (var i = 0, id; id == ids[i]; i++) {
                    if (!cache[getCanonicalName(site, type, ids[i])]) {
                        finalIDs.push(id);
                    }
                }
                for (var ii = 0, x = finalIDs.length; ii < x; ii += 50) {
                    ids = finalIDs.slice(ii, ii + 50);
                    var url = '/' + type + '/tooltip/' + ids.join(';');
                    if (remote || FH.DOMAIN != site) {
                        if (!sites[site]) {
                            continue;
                        }
                        url = 'https://' + sites[site].url + url;
                    } else {
                        url = getServerUrl() + url;
                    }
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = url;
                    addResource(script);
                    var numIds = ids.length;
                    for (var j = 0; j < numIds; ++j) {
                        cache[getCanonicalName(site, type, ids[j])] = true;
                    }
                }
            }
        }
    };
    this.updateLinks = function(site, type) {
        if (!this.addIcons && !this.colorLinks && !this.renameLinks) {
            return;
        }
        for (var tags = document.getElementsByTagName('a'), i = tags.length; i--;) {
            var a = tags[i];
            var opts = a.rel.split(' ');
            if (a.zamModified) {
                continue;
            }
            var match = scan(a, true, true);
            if (!match || match.site != site || match.type != type || a.attributes['data-zamtooltip']) {
                continue;
            }
            var canonical = getCanonicalName(match.site, match.type, match.id);
            if (!cache[canonical]) {
                continue;
            }
            var info = cache[canonical];
            if (info === true) {
                continue;
            }
            a.zamModified = true;
            if ((this.renameLinks || opts.indexOf('rename')) && info.name && opts.indexOf('protect') == -1 && opts.indexOf('!rename') == -1) {
                a.innerHTML = info.name;
            }
            if ((this.renameLinks || opts.indexOf('color')) && info['class'] && opts.indexOf('protect') == -1 && opts.indexOf('!color') == -1) {
                a.className += ' ' + info['class'];
            }
            if ((this.addIcons || opts.indexOf('icon')) && info.icon && opts.indexOf('protect') == -1 && opts.indexOf('!icon') == -1) {
                var span = document.createElement('span');
                span.innerHTML = info.icon;
                var link = span.getElementsByTagName('a')[0];
                if (link) {
                    link.zamModified = true;
                    link.setAttribute('data-' + match.site, match.type + '=' + match.id);
                    if (a.href) {
                        link.href = a.href;
                    }
                }
                a.parentNode.insertBefore(span, a);
            }
        }
    };

    this.lastElement = null;

    this.show = function(site, type, id, attach, element) {

        if ($("#move-popup").is(':visible')) {
            return false;
        }

        if (element) this.lastElement = element;
        var canonical = getCanonicalName(site, type, id);
        if (type == 'custom') {
            cache[canonical] = id;
        }
        if (!cache[canonical]) {
            fetch(site, type, id);
        }
        var info = cache[canonical];
        if (!info) {
            return;
        }
        if (!container) return;
        if (info === true) {
            container.innerHTML = sites[site].tt.replace('@text@', 'Loading...');
        } else if (type == "custom") {
            container.innerHTML = sites[site].ttFluid.replace('@text@', info);
        } else {
            container.innerHTML = info.tooltip.replace(/\/\/desimg.zamimg.com/g, 'https://desimg.zamimg.com');
            this.renderCallback(info, container.innerHTML, this.lastElement, function(newContent) {
                container.innerHTML = newContent;
            });
        }
        activeTooltip = canonical;
        attachedTo = attach;
        this.update();
    };
    this.update = function() {
        container.style.display = 'block';
        container.onclick = function() {
            $ZamTooltips.hide();
        };
        var win = getWindowInfo();
        var w = container.offsetWidth,
            h = container.offsetHeight;
        var pos;
        if (attachedTo) {
            var dim = getElementDimensions(attachedTo);
            pos = reposition(dim, win, w, h);
        } else {
            var mousePos = getMousePos(lastEvent);
            pos = reposition({
                x: mousePos.x,
                y: mousePos.y,
                w: 0,
                h: 0
            }, win, w, h);
        }
        container.style.left = pos.left + 'px';
        container.style.top = pos.top + 'px';
    };
    this.scanAtCursor = function(event) {
        var x = event.clientX,
            y = event.clientY;
        var target = document.elementFromPoint(x, y);
        if (target) {
            onMouseover({
                target: target
            });
        }
    };
    this.hide = function() {
        activeTooltip = false;
        attachedTo = false;
        if (container && container.style) {
            container.style.display = 'none';
            container.innerHTML = '';
        }
    };
    this.add = function(site, id, tooltip) {
        var canonical = getCanonicalName(site, "custom", id);
        cache[canonical] = tooltip;
    };
    this.onTooltip = function(tooltips) {
        if (!tooltips.length) {
            return;
        }
        var site, type;
        var numTooltips = tooltips.length;
        for (var i = 0; i < numTooltips; i++) {
            var info = tooltips[i];
            if (!info.site || !info.type || !info.id || !info.tooltip) {
                continue;
            }
            var canonical = getCanonicalName(info.site, info.type, info.id);
            cache[canonical] = info;
            site = info.site;
            type = info.type;
            if (activeTooltip == canonical) {
                //console.log('about to show via onTooltip');
                this.show(info.site, info.type, info.id, attachedTo);
            }
        }
        this.updateLinks(site, type);
    };
    var onMouseover = function(event) {
        if ($ZamTooltips.enabled() === true) {
            var t = event.target ? event.target : event.srcElement;
            lastEvent = event;
            var i = 0;
            while (t && i < 5 && !scan(t)) {
                t = t.parentNode;
                i++;
            }
        }
    };
    var onMousemove = function(event) {
        if ($ZamTooltips.enabled() === true) {
            lastEvent = event;
            $ZamTooltips.update();
        }
    };
    var onMouseout = function(event) {
        if ($ZamTooltips.enabled() === true) {
            lastEvent = event;
            $ZamTooltips.hide();
            var t = event.target ? event.target : event.srcElement;
            removeEvent(t, 'mousemove', onMousemove);
            removeEvent(t, 'mouseout', onMouseout);
        }
    };
    var padding = {
        x: 10,
        y: 4
    };
    var reposition = function(dim, win, w, h) {
        var left = dim.x + dim.w + padding.x;
        var top = dim.y - h - padding.y;
        if (left + w > win.right) {
            left = dim.x - w - padding.x;
            if (left < win.left) {
                left = win.right - w - padding.x;
            }
        }
        if (dim.y + h + padding.y > win.bottom && top < win.top) {
            top = win.bottom - h - padding.y;
        } else if (top < win.top) {
            top = dim.y + dim.h + padding.y;
        }
        return {
            left: left,
            top: top
        };
    };
    var fetchLocal = function(id) {
        var tooltips = [new tgd.Tooltip(id)];
        $ZamTooltips.onTooltip(tooltips);
    };
    var fetch = function(site, type, id) {
        // loadCss(site);
        var canonical = getCanonicalName(site, type, id);
        cache[canonical] = true;
        if (tgd.itemsNotIndexed.indexOf(parseFloat(id)) > -1) {
            fetchLocal(id);
        } else {
            var url = '/' + type + '/tooltip/' + id;
            if (!remote && FH.DOMAIN == site) {
                url = getServerUrl() + url;
            } else {
                if (!sites[site]) {
                    return false;
                }
                url = 'https://' + sites[site].url + url;
            }

            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            var isLoaded = false;
            script.onload = script.onreadystatechange = function() {
                if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
                    // script successfully loaded
                    isLoaded = true;
                }
                if (!isLoaded || !_.isObject(cache[canonical])) {
                    fetchLocal(id);
                }
            };
            addResource(script);
            setTimeout(function() {
                if (!_.isObject(cache[canonical])) {
                    fetchLocal(id);
                }
            }, 3 * 1000);
        }

        return true;
    };
    // var loadCss = function(site) {
    //     if ((!remote && site == FH.DOMAIN) || sites[site].css) {
    //         return;
    //     }
    //     var link = document.createElement('link');
    //     link.rel = 'stylesheet';
    //     link.type = 'text/css';
    //     link.href = sites[site].cdn + '/asset/css/tooltips.min.css';
    //     addResource(link);
    //     sites[site].css = true;
    // };
    var scan = function(t, partOfPreload, basicScan) {
        if (!t.attributes || !t.attributes['data-zamtooltip']) {
            if (t.nodeName != 'A' || (t.href.length === 0 && t.rel.length === 0) || t.rel.indexOf('nott') != -1 || t.rel.indexOf('!tt') != -1 || t.href.indexOf(location.href + '#') != -1) {
                return false;
            }
        }
        var url = t.href;
        if (!url) {
            var as = t.getElementsByTagName('a');
            for (var i = 0, a; a = as[i]; i++) {
                url = a.href;
                if (url) break;
            }
            if (!url) {
                return false;
            }
        }
        if (remote && !url.match(reAllSites)) {
            return false;
        } else if (!remote && sites[FH.DOMAIN]) {
            url = url.replace(reLocalUrl, sites[FH.DOMAIN].url + '$2');
        }
        var match = testDataAttrib(t);
        if (!match) {
            match = testUrl(url);
        }
        if (!match) {
            return false;
        }
        if (!partOfPreload) {
            addEvent(t, 'mouseout', onMouseout);
            var attach = false;
            if (t.parentNode.className.indexOf('fh-icon') > -1) {
                attach = t.parentNode;
            } else if (t.className.indexOf('fh-icon') > -1 || t.getAttribute('data-fhttattach') == 'true') {
                attach = t;
            }
            addEvent(t, 'mousemove', onMousemove);
            //console.log('About to show via scan');
            $ZamTooltips.show(match.site, match.type, match.id, attach, t);
            return true;
        } else if (!t.preloaded || basicScan) {
            t.preloaded = true;
            return match;
        } else {
            return match;
        }
    };
    var testUrl = function(url) {
        for (var s in sites) {
            if (!sites.hasOwnProperty(s)) {
                continue;
            }
            var site = sites[s];
            var match = site.re.exec(url);
            if (match) {
                return {
                    site: s,
                    type: match[1],
                    id: match[2]
                };
            }
        }
        return false;
    };
    var testDataAttrib = function(t) {
        var attr = t.attributes['data-zamtooltip'];
        if (attr) {
            var split = attr.value.split('=');
            if (split.length == 2 && sites[split[0]]) {
                return {
                    site: split[0],
                    type: "custom",
                    id: split[1]
                };
            }
            return false;
        }
        return false;
    };
};

window.$ZamTooltips = new $ZamTooltips();
//# sourceMappingURL=4.extras.js.map