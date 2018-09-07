function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};



var deck = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor",
    "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf",
    "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"
];


var open = [];
var matched = 0;
var moveCounter = 0;
var numStars = 3;
var timer = {
    seconds: 0,
    minutes: 0,
    clearTime: -1
};


var hard = 15;
var medium = 20;

var modal = $("#win-modal");




var startTimer = function() {
    if (timer.seconds === 59) {
        timer.minutes++;
        timer.seconds = 0;
    } else {
        timer.seconds++;
    }


    var formattedSec = "0";
    if (timer.seconds < 10) {
        formattedSec += timer.seconds
    } else {
        formattedSec = String(timer.seconds);
    }

    var time = String(timer.minutes) + ":" + formattedSec;
    $(".timer").text(time);
};


function resetTimer() {
    clearInterval(timer.clearTime);
    timer.seconds = 0;
    timer.minutes = 0;
    $(".timer").text("0:00");

    timer.clearTime = setInterval(startTimer, 1000);
};


function updateCards() {
    deck = shuffle(deck);
    var index = 0;
    $.each($(".card i"), function() {
        $(this).attr("class", "fa " + deck[index]);
        index++;
    });
    resetTimer();
};


function showModal() {
    modal.css("display", "block");
};


function removeStar() {
    $(".fa-star").last().attr("class", "fa fa-star-o");
    numStars--;
    $(".num-stars").text(String(numStars));
};


function resetStars() {
    $(".fa-star-o").attr("class", "fa fa-star");
    numStars = 3;
    $(".num-stars").text(String(numStars));
};


function updateMoveCounter() {
    $(".moves").text(moveCounter);

    if (moveCounter === hard || moveCounter === medium) {
        removeStar();
    }
};


function isValid(card) {
    return !(card.hasClass("open") || card.hasClass("match"));
};


function checkMatch() {
    if (open[0].children().attr("class") === open[1].children().attr("class")) {
        return true;
    } else {
        return false;
    }
};


function hasWon() {
    if (matched === 16) {
        return true;
    } else {
        return false;
    }
};


var setMatch = function() {
    open.forEach(function(card) {
        card.addClass("match");
    });
    open = [];
    matched += 2;

    if (hasWon()) {
        clearInterval(timer.clearTime);
        showModal();
    }
};


var resetOpen = function() {
    open.forEach(function(card) {
        card.toggleClass("open");
        card.toggleClass("show");
    });
    open = [];
};


function openCard(card) {
    if (!card.hasClass("open")) {
        card.addClass("open");
        card.addClass("show");
        open.push(card);
    }
};


var resetGame = function() {
    open = [];
    matched = 0;
    moveCounter = 0;
    resetTimer();
    updateMoveCounter();
    $(".card").attr("class", "card");
    updateCards();
    resetStars();
};


var onClick = function() {
    if (isValid($(this))) {

        if (open.length === 0) {
            openCard($(this));

        } else if (open.length === 1) {
            openCard($(this));
            moveCounter++;
            updateMoveCounter();

            if (checkMatch()) {
                setTimeout(setMatch, 300);

            } else {
                setTimeout(resetOpen, 700);

            }
        }
    }
};


var playAgain = function() {
    resetGame();
    modal.css("display", "none");
};


$(".card").click(onClick);
$(".restart").click(resetGame);
$(".play-again").click(playAgain);


$(updateCards);
