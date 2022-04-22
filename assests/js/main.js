var masonryLoaded = 0;
var masonryUpdate;
var clmnwidth = 0;
var countclmn = 0;
var index = 1;
var commons = [];
var newword = {};
var list = [];
var commonscolors = [];
var listcolors = [];
var loaded = false;

window.addEventListener(
  "resize",
  function (event) {
    resizeclm();
    if (masonryLoaded == 1) {
      updatemasonry();
    }
  },
  true
);

//load next offset after scroll to end of page and fixed header(desktop view)
$(window).scroll(function () {
  if (
    $(window).scrollTop() >=
    $(document).height() - $(window).height() - 100
  ) {
    if (loaded) {
      index++;
      appendemptycell();
    }
  }
  var top = this.scrollY,
    left = this.scrollX;
  var heightheader = $("header").innerHeight();
  if (top > heightheader) {
    $("header").addClass("fixed");
    $(".infoBoard").css("margin-top", heightheader);
  } else {
    $("header").removeClass("fixed");
    $(".infoBoard").css("margin-top", 0);
  }
});

$(document).on("click", function (e) {
  if (
    $(e.target).closest("#search").length === 0 &&
    !$(".smalldevice").is(":visible")
  ) {
    $(".search-expand").removeClass("show");
    $("header").find("div.bgoverlay").remove();
  }

  if (
    $(e.target).closest(".tooltipmore").length === 0 &&
    $(e.target).closest(".more").length === 0
  ) {
    $(".tooltipmore").remove("");
  }
});

//append null tile befor load complete
function appendemptycell() {
  loaded = false;
  resizeclm();
  var countrpt = window.innerWidth > 768 ? 2 : 6;
  for (var i = 0; i < countclmn * countrpt; i++) {
    $(".content").append(
      '<div class="pin card_pin" style="height:' +
        randomIntFromInterval(270, 330) +
        'px;"><div class="card_pin__image"></div><div class="card_pin__tags"><ul class=""><li></li><li></li><li></li></ul></div><div class="card_pin__title"><p></p></div></div>'
    );
  }
  resizeclm();
  updatemasonry();
  setTimeout(function () {
    getdata();
  }, 10);
}

//update positions tiles
function updatemasonry() {
  var content = $(".content");
  $(content).masonry("reloadItems");
  $(content).masonry("layout");
}

//resize columns when user resize windows
function resizeclm() {
  countclmn = Math.round(window.innerWidth / 236);
  $(".content .pin").css("width", window.innerWidth / countclmn);
  $(".content").css("width", window.innerWidth - 30);
}

$(document).ready(function () {
  if (window.innerWidth > 1445) {
    countclmn = Math.round(window.innerWidth / 236);
  }
  if (masonryLoaded == 0) {
    $.ajax({
      dataType: "script",
      cache: true,
      async: false,
      url: "https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js",
      success: function (response) {
        masonryLoaded = 1;
        $(".content").masonry({
          itemSelector: ".pin",
          fitWidth: true,
          transitionDuration: 0.3,
        });
        appendemptycell();
      },
    });
  }

  $("body").delegate(".content div.pin div.outerimg", "mouseover", function () {
    $(this).addClass("showoptions");
  });

  $("body").delegate("header a.clear", "click", function () {
    $("#txtsearch").val("");
    $("#txtsearchsmall").val("");
    $(".search-expand").empty();
    generatAdditionalSearch();
    $("a.clear").hide();
  });

  $("body").delegate(
    ".content div.pin div.outerimg",
    "mouseleave",
    function () {
      $(this).removeClass("showoptions");
    }
  );

  $("body").delegate("header #txtsearch", "keyup", function () {
    var value = $(this).val();
    showresultsearch(value);
  });

  $("body").delegate("header #txtsearchsmall", "keyup", function () {
    var value = $(this).val();
    showresultsearch(value);
  });

  $("body").delegate("header #txtsearchsmall", "keypress", function () {
    var value = $(this).val();
    showresultsearch(value);
  });

  $("body").delegate(
    "div.content div.pin div.options a.more",
    "click",
    function () {
      if ($("#tooltipmore").is(":visible")) $("#tooltipmore").hide();
      $("#tooltipmore").remove();
      var tooltipmore =
        '<ul id="tooltipmore" class="tooltipmore"><li>Hide Pin</li><li>Download image</li><li>Report Pin</li></ul>';
      $(this).parent().closest("div.content").append(tooltipmore);
      var elementHeight = $(this).height();

      var positiontop =
        $(this).parent().closest("div.pin").position().top +
        $(this).parent().closest("div.pin").find("img").height() -
        10;

      $("#tooltipmore").css({
        top: positiontop,
        left: $(this).parent().closest("div.pin").position().left,
        width: $(this).parent().closest("div.pin").width() - 10,
      });
      $("#tooltipmore").show();
    }
  );
});

//show results search by data loaded
function showresultsearch(value) {
  if (value.length > 1) {
    $("a.clear").show();
    $(".search-expand").empty();
    if ($(".smalldevice").is(":visible")) {
      $(".smalldevice .search-expand").append(
        '<ul class="row list-inline mx-auto justify-content-center mb-5 result"></ul>'
      );
    } else {
      $(".largedevice .search-expand").append(
        '<ul class="row list-inline mx-auto justify-content-center mb-5 result"></ul>'
      );
    }
    list.filter(function (element) {
      if (element.description.indexOf(value) != -1) {
        if ($(".smalldevice").is(":visible")) {
          var src_str = element.description;
          var term = value;
          term = term.replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
          var pattern = new RegExp("(" + term + ")", "gi");
          src_str = src_str.replace(pattern, "<mark>$1</mark>");
          src_str = src_str.replace(
            /(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/,
            "$1</mark>$2<mark>$4"
          );
          $(".smalldevice .search-expand ul.result").append(
            '<li class="border-bottom"><a data-searhed="' +
              value +
              '"><h5>' +
              element.name +
              "</h5><p>" +
              src_str +
              "</p></a></li>"
          );
        } else {
          var src_str = element.description;
          var term = value;
          term = term.replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
          var pattern = new RegExp("(" + term + ")", "gi");
          src_str = src_str.replace(pattern, "<mark>$1</mark>");
          src_str = src_str.replace(
            /(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/,
            "$1</mark>$2<mark>$4"
          );

          $(".largedevice .search-expand ul.result").append(
            '<li class="border-bottom"><a data-searhed="' +
              value +
              '"><h5>' +
              element.name +
              "</h5><p>" +
              src_str +
              "</p></a></li>"
          );
        }
      }
    });
  } else {
    $("a.clear").hide();
    $(".search-expand").empty();
    generatAdditionalSearch();
  }
}

let lazyImages = [...document.querySelectorAll(".lazy-image")],
  inAdvance = 900;

//get original data
function getdata() {
  $.ajax({
    url:
      "https://xoosha.com/ws/1/test.php?offset=" +
      index +
      "&nocache=" +
      new Date().getTime(),
    type: "GET",
    cache: false,
    timeout: 12000,
    success: function (response) {
      loaded = true;
      $(".content div.card_pin").remove();
      var nospace = [];
      var nt = "";
      response.forEach((element) => {
        nt = nt + (element.tags != null ? element.tags : "");
        list.push(element);
        var splitedtags = element.tags != null ? element.tags.split(",") : "";
        var lis = "";
        for (var i = 0; i < splitedtags.length; i++) {
          if (splitedtags[i].length > 0)
            lis = lis + "<li>" + splitedtags[i] + "</li>";
        }
        var tagsli = '<ul class="tags">' + lis + "</ul>";
        $(".content").append(
          '<div class="pin" data-id="' +
            element.page_id +
            '"><div class="outerimg"><div class="options"><div class="boards"><b><i class="icon-arrow_down"></i>birthday gift</b><a>Save</a></div><div class="bottom-option row"><div class="col-2 col-sm-3 col-md-3 col-lg-3 col-xl-3 p-0 pl-1 lft text-left"><a><i class="icon-favorite"></i></a></div><div class="col-10 col-sm-9 col-md-9 col-lg-9 col-xl-9 p-0 pr-1 rt"><a onclick=openlink(this)><i class="icon-keyback"></i></a><a><i class="icon-share"></i></a><a class="more"><i class="icon-more"></i></a></div></div></div><img crossOrigin ="anonymous" class="lazy-image" data-src="' +
            element.image_url +
            '" /></div>' +
            tagsli +
            "<p>" +
            element.name +
            "</p></div>"
        );
      });

      lazyImages = [...document.querySelectorAll(".lazy-image")];

      resizeclm();
      updatemasonry();
      let colorThief = new ColorThief();
      //append common color every image
      for (var i = 0; i < lazyImages.length; i++) {
        var loadedcount = 0;
        const img = lazyImages[i];

        img.onerror = () => {
          img.src = "./assests/img/brokenimage.jpg";
          $(img).parent().closest("div.pin").addClass("loaded");
          $(img).removeClass("lazy-image");
          $(img).attr("data-src", "");
          $(img).addClass("errorimg");
        };

        img.src = $(img).attr("data-src");
        img.onload = () => {
          $(img).crossOrigin = "anonymous";
          $(img).parent().closest("div.pin").addClass("loaded");
          loadedcount = loadedcount + 1;

          if ($(img).hasClass("errorimg")) {
            updatemasonry();
            return;
          }

          let result = ntc.name(
            "#" +
              colorThief
                .getColor(img)
                .map((x) => {
                  const hex = x.toString(16);
                  return hex.length === 1 ? "0" + hex : hex;
                })
                .join("")
          );

          $(img).after(
            '<a id="commoncolor" style="background-color: ' +
              result[0] +
              ";border:solid 1px " +
              hex2rgba(result[2], 0.7) +
              ';"></a>'
          );
          $(img)
            .parent()
            .closest("div.pin")
            .css("border-color", hex2rgba(result[0], 0.37));
          $(img).removeClass("lazy-image");
          var objcolor = {};
          objcolor.name = result[3];
          objcolor.hex = result[0];
          listcolors.push(objcolor);

          updatemasonry();
          if (loadedcount == lazyImages.length) {
          }
        };
      }
      var tagssplitedarr = nt.split(",");
      tagssplitedarr.forEach((data) => {
        if (data.indexOf(" ") > -1) nospace.push(data);
      });
      for (let word of nospace) {
        if (newword[word]) {
          newword[word]++;
          var foundIndex = commons.findIndex((x) => x.name == word);
          commons[foundIndex].count++;
        } else {
          newword[word] = 1;
          var obj = {};
          obj.name = word;
          obj.count = 1;
          commons.push(obj);
        }
      }
      commons.sort((a, b) => a.count - b.count);
    },
    error: function (xhr, status, error) {
      alert(xhr.responseText);
    },
  });
}

//get hex color
const hex2rgba = (hex, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function onfocussearch(e) {
  if ($(".search-expand").hasClass("show")) return;
  $(".search-expand").addClass("show");
  $("header").append('<div class="bgoverlay"></div>');

  var newcolor = {};
  for (let color of listcolors) {
    var foundIndex = commonscolors.findIndex((x) => x.name == color.name);
    if (foundIndex > -1) {
      commonscolors[foundIndex].count++;
    } else {
      newcolor[color] = 1;
      var obj = {};
      obj.name = color.name;
      obj.hex = color.hex;
      obj.count = 1;
      commonscolors.push(obj);
    }
  }

  $(".search-expand").empty();

  var value = $(e).val();
  if (value.length > 0) showresultsearch(value);
  else generatAdditionalSearch();
}

//generate adtinal search: Ideas for you, Common colors
function generatAdditionalSearch() {
  if ($(".smalldevice").is(":visible")) {
    $(".smalldevice .search-expand").append(
      '<h4>Ideas for you</h4><ul class="row list-inline mx-auto justify-content-center mb-5 border-bottom ideas"></ul>'
    );
    try {
      var indexadded = 0;
      for (let j = 1; j < 10; j++) {
        let result = list.filter((data) =>
          data.tags != null
            ? data.tags.includes(commons[commons.length - j].name)
            : ""
        );
        if (result.length > 0 && indexadded < 5) {
          $(".smalldevice .search-expand ul").append(
            '<li class="col-2 col-md-3 col-5 col-sm-3"><img src="' +
              result[0].image_url +
              '"/><a>' +
              commons[commons.length - j].name +
              "</a></li>"
          );
          indexadded++;
        }
      }
    } catch (e) {}
    commonscolors.sort((a, b) => a.count - b.count);
    $(".smalldevice .search-expand").append(
      '<h4>Common colors</h4><ul class="commoncolors row list-inline mx-auto justify-content-center commoncolors"></ul>'
    );
    for (let j = 1; j < 6; j++) {
      {
        $(".smalldevice .search-expand ul.commoncolors").append(
          '<li style="background-color:' +
            commonscolors[commonscolors.length - j].hex +
            '" class="col"><a>' +
            commonscolors[commonscolors.length - j].name +
            "</a></li>"
        );
      }
    }
  } else {
    $(".largedevice .search-expand").append(
      '<h4>Ideas for you</h4><ul class="row list-inline mx-auto justify-content-center mb-5 border-bottom ideas"></ul>'
    );
    try {
      var indexadded = 0;
      for (let j = 1; j < 10; j++) {
        let result = list.filter((data) =>
          data.tags != null
            ? data.tags.includes(commons[commons.length - j].name)
            : ""
        );
        if (result.length > 0 && indexadded < 5) {
          $(".search-expand ul").append(
            '<li class="col-2 col-md-3 col-lg-3 col-xl-2"><img src="' +
              result[0].image_url +
              '"/><a>' +
              commons[commons.length - j].name +
              "</a></li>"
          );
          indexadded++;
        }
      }
    } catch (e) {}
    commonscolors.sort((a, b) => a.count - b.count);
    $(".largedevice .search-expand").append(
      '<h4>Common colors</h4><ul class="commoncolors row list-inline mx-auto justify-content-center commoncolors"></ul>'
    );
    for (let j = 1; j < 6; j++) {
      {
        if (commonscolors[commonscolors.length - j].hex !== null)
          $(".largedevice .search-expand ul.commoncolors").append(
            '<li style="background-color:' +
              commonscolors[commonscolors.length - j].hex +
              '" class="col"><a>' +
              commonscolors[commonscolors.length - j].name +
              "</a></li>"
          );
      }
    }
  }
}

function showsearchbox() {
  $(".search-expand").empty();
  var newcolor = {};
  for (let color of listcolors) {
    var foundIndex = commonscolors.findIndex((x) => x.name == color.name);
    if (foundIndex > -1) {
      commonscolors[foundIndex].count++;
    } else {
      newcolor[color] = 1;
      var obj = {};
      obj.name = color.name;
      obj.hex = color.hex;
      obj.count = 1;
      commonscolors.push(obj);
    }
  }
  generatAdditionalSearch();
  $("header div.smalldevice div#search").addClass("show");
  $("header div.smalldevice .search-expand").addClass("show");
  $("div.navigationbar a").removeClass("active");
  $("div.navigationbar a:nth-child(2)").addClass("active");
}

function hidesearchbox() {
  $("#txtsearchsmall").val("");
  $("header div.smalldevice div#search").removeClass("show");
  $("header div.largedevice div#search").removeClass("show");
  $("div.navigationbar a").addClass("active");
  $("div.navigationbar a:nth-child(2)").removeClass("active");
}

//open new tab links
function openlink(e) {
  var dataid = $(e).parent().closest("div.pin").attr("data-id");
  var foundIndex = list.findIndex((x) => x.page_id == dataid);
  var href = list[foundIndex].url;
  window.open(href, "_blank").focus();
}
