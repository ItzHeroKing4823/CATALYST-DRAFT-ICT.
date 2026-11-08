// Yangon outbreak map. Each township is a clickable area drawn as plain SVG,
// so it works without map tiles or internet libraries.
// Township shapes come from township-shapes.js, health information from outbreak-data.js.

const SVG_NS = "http://www.w3.org/2000/svg";

// Size of the map drawing
const MAP_WIDTH = 640;
const MAP_HEIGHT = 600;

function makeSvg(tag, attributes) {
    const element = document.createElementNS(SVG_NS, tag);
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    return element;
}

const svg = document.getElementById("map");
const regionSelect = document.getElementById("regionSelect");
const regionLevel = document.getElementById("regionLevel");
const regionTitle = document.getElementById("regionTitle");
const regionIntro = document.getElementById("regionIntro");
const regionItems = document.getElementById("regionItems");
const regionAdvice = document.getElementById("regionAdvice");
const townshipChips = document.getElementById("townshipChips");
const hoverName = document.getElementById("hoverName");

const areas = {};
const names = {};
const chips = {};
let selectedRegion = "";

// How far the map is zoomed in (1 = whole city)
let zoom = 1;
const ZOOM_LEVELS = [1, 2, 4];

// The land is cut to the shape of Yangon city, the rest stays as water
function drawLand() {
    const defs = makeSvg("defs", {});
    const clip = makeSvg("clipPath", { id: "cityClip" });
    clip.appendChild(makeSvg("path", { d: MAP_OUTLINE }));
    defs.appendChild(clip);
    svg.appendChild(defs);

    const land = makeSvg("g", { "clip-path": "url(#cityClip)" });
    svg.appendChild(land);
    return land;
}

function drawArea(land, region) {
    const shape = TOWNSHIP_SHAPES[region.name];

    const path = makeSvg("path", {
        d: shape.d,
        "class": "area area-" + region.level,
        tabindex: "0",
        role: "button",
        "aria-label": `${region.name} Township: ${LEVEL_NAMES[region.level]}`
    });

    const title = makeSvg("title", {});
    title.textContent = region.name + " Township";
    path.appendChild(title);

    path.addEventListener("click", () => selectRegion(region.name, true));
    path.addEventListener("keydown", (event) => {
        if (event.key == "Enter" || event.key == " ") {
            event.preventDefault();
            selectRegion(region.name, true);
        }
    });
    path.addEventListener("mouseenter", () => {
        hoverName.textContent = region.name + " Township";
    });
    path.addEventListener("mouseleave", () => {
        hoverName.textContent = "";
    });

    land.appendChild(path);
    areas[region.name] = path;
}

// Township names are written on top of the areas
function drawNames() {
    const group = makeSvg("g", { "class": "area-names" });
    svg.appendChild(group);

    REGIONS.forEach((region) => {
        const shape = TOWNSHIP_SHAPES[region.name];
        const text = makeSvg("text", { x: shape.x, y: shape.y, "class": "area-name", "text-anchor": "middle" });
        text.textContent = region.name;
        group.appendChild(text);
        names[region.name] = text;
    });
}

// Zoom the map by changing the viewBox, centred on a township
function showView(centreName) {
    const width = MAP_WIDTH / zoom;
    const height = MAP_HEIGHT / zoom;
    const shape = TOWNSHIP_SHAPES[centreName];

    let left = shape.x - width / 2;
    let top = shape.y - height / 2;
    left = Math.min(Math.max(left, 0), MAP_WIDTH - width);
    top = Math.min(Math.max(top, 0), MAP_HEIGHT - height);
    if (zoom == 1) {
        left = 0;
        top = 0;
    }
    svg.setAttribute("viewBox", `${left} ${top} ${width} ${height}`);

    // Names: none at zoom 1, big townships at zoom 2, all townships at zoom 4
    REGIONS.forEach((region) => {
        const size = TOWNSHIP_SHAPES[region.name].size;
        let show = false;
        if (zoom == 4) {
            show = true;
        } else if (zoom == 2 && size > 5000) {
            show = true;
        }
        if (region.name == selectedRegion) {
            show = true;
        }
        names[region.name].style.display = show ? "block" : "none";
        names[region.name].setAttribute("font-size", 15 / zoom);
    });

    document.getElementById("zoomText").textContent = zoom + "x";
    document.getElementById("zoomIn").disabled = (zoom == 4);
    document.getElementById("zoomOut").disabled = (zoom == 1);
}

function changeZoom(step) {
    const place = ZOOM_LEVELS.indexOf(zoom) + step;
    if (place < 0 || place >= ZOOM_LEVELS.length) {
        return;
    }
    zoom = ZOOM_LEVELS[place];
    showView(selectedRegion);
}

function addInfoItem(list, item) {
    const li = document.createElement("li");

    const title = document.createElement("strong");
    title.textContent = item.disease + ": ";
    li.appendChild(title);
    li.appendChild(document.createTextNode(item.text));

    if (item.src != null) {
        li.appendChild(document.createTextNode(" "));
        const link = document.createElement("a");
        link.href = SOURCES[item.src].url;
        link.target = "_blank";
        link.rel = "noopener";
        link.className = "source-link";
        link.textContent = `[${SOURCES[item.src].name}]`;
        li.appendChild(link);
    }
    list.appendChild(li);
}

// fromMap is true when the township was clicked on the map itself
function selectRegion(name, fromMap) {
    if (selectedRegion != "") {
        areas[selectedRegion].classList.remove("selected");
        chips[selectedRegion].classList.remove("selected");
    }
    selectedRegion = name;
    areas[name].classList.add("selected");
    chips[name].classList.add("selected");
    // Move the selected area to the front so its outline is not hidden by its neighbours
    areas[name].parentNode.appendChild(areas[name]);
    regionSelect.value = name;

    const region = getRegion(name);
    let info = region;
    if (region.items == undefined) {
        info = DEFAULT_REGION;
    }

    regionLevel.hidden = false;
    regionLevel.className = "level-tag level-" + region.level;
    regionLevel.textContent = LEVEL_NAMES[region.level];

    regionTitle.textContent = name + " Township";
    regionIntro.textContent = `Yangon Region. Reviewed on ${OUTBREAK_UPDATED}:`;

    regionItems.innerHTML = "";
    info.items.forEach((item) => addInfoItem(regionItems, item));

    regionAdvice.textContent = "What to do: " + info.advice;
    regionAdvice.hidden = false;

    document.getElementById("regionLink").href = "hospital-directory.html?township=" + encodeURIComponent(name);

    // Keep the chosen township in the middle of the view when the map is zoomed
    showView(name);

    // On a phone the information is below the map, so scroll down to it
    if (fromMap == true && window.innerWidth < 900) {
        document.getElementById("infoBox").scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// Show only the townships that match the chosen button
function setFilter(tag, button) {
    const buttons = document.getElementById("mapFilters").getElementsByTagName("button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }
    button.classList.add("active");

    let matches = 0;
    REGIONS.forEach((region) => {
        let match = true;
        switch (tag) {
            case "alert":
            case "earlier":
            case "watch":
                match = region.level == tag;
                break;
            default:
                match = true;
        }
        if (match) {
            matches = matches + 1;
            areas[region.name].classList.remove("dimmed");
            chips[region.name].hidden = false;
        } else {
            areas[region.name].classList.add("dimmed");
            chips[region.name].hidden = true;
        }
    });
    document.getElementById("filterCount").textContent = `${matches} of ${REGIONS.length} townships shown`;
}

function makeChips() {
    // Alphabetical list of townships, alert townships first
    const order = REGIONS.slice().sort((a, b) => a.name.localeCompare(b.name));
    const levels = ["alert", "earlier", "watch"];

    levels.forEach((level) => {
        order.filter((region) => region.level == level).forEach((region) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "chip chip-" + level;
            button.textContent = region.name;
            button.addEventListener("click", () => selectRegion(region.name, false));
            townshipChips.appendChild(button);
            chips[region.name] = button;
        });
    });
}

function showCitywide() {
    const box = document.getElementById("nationalList");

    NATIONAL.forEach((fact) => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("data-aos", "fade-up");
        card.innerHTML = `<div class="card-body"><span class="card-tag">Myanmar data</span><h3></h3><p></p><a class="source-link" target="_blank" rel="noopener"></a></div>`;

        card.querySelector("h3").textContent = fact.disease;
        card.querySelector("p").textContent = fact.text;
        const link = card.querySelector("a");
        link.href = SOURCES[fact.src].url;
        link.textContent = "Source: " + SOURCES[fact.src].name;
        box.appendChild(card);
    });
}

// A small digital clock for Yangon time (Myanmar Standard Time)
function showClock() {
    const now = new Date();
    const time = now.toLocaleTimeString("en-GB", { timeZone: "Asia/Yangon", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    document.getElementById("yangonClock").textContent = time;
}

// Start
const land = drawLand();
REGIONS.forEach((region) => drawArea(land, region));
svg.appendChild(makeSvg("path", { d: MAP_OUTLINE, "class": "city-edge" }));
drawNames();

const firstOption = document.createElement("option");
firstOption.value = "";
firstOption.textContent = "Select a township...";
regionSelect.appendChild(firstOption);

REGIONS.slice().sort((a, b) => a.name.localeCompare(b.name)).forEach((region) => {
    regionSelect.appendChild(new Option(region.name + " Township", region.name));
});

makeChips();

regionSelect.addEventListener("change", () => {
    if (regionSelect.value != "") {
        selectRegion(regionSelect.value, false);
    }
});

document.getElementById("zoomIn").addEventListener("click", () => changeZoom(1));
document.getElementById("zoomOut").addEventListener("click", () => changeZoom(-1));

const filterButtons = document.getElementById("mapFilters").getElementsByTagName("button");
for (let k = 0; k < filterButtons.length; k++) {
    filterButtons[k].addEventListener("click", function () {
        setFilter(this.dataset.tag, this);
    });
}

document.getElementById("updatedDate").textContent = OUTBREAK_UPDATED;
document.getElementById("alertCount").textContent = REGIONS.filter((region) => region.level == "alert").length;
showCitywide();
showClock();
setInterval(showClock, 1000);
setFilter("all", filterButtons[0]);

// Open the township from the web address, for example map.html?region=Latha
const wanted = new URLSearchParams(window.location.search).get("region");
if (wanted != null && getRegion(wanted) != null) {
    selectRegion(wanted, false);
} else {
    selectRegion("Latha", false);
}
