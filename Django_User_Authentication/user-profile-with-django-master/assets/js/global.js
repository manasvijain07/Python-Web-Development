$(document).ready(function () {

    $('textarea').autogrow({onInitialize: true});

    // Cloner for infinite input lists
    $(".circle--clone--list").on("click", ".circle--clone--add", function () {
        var parent = $(this).parent("li");
        var copy = parent.clone();
        parent.after(copy);
        copy.find("input, textarea, select").val("");
        copy.find("*:first-child").focus();
    });

    $(".circle--clone--list").on("click", "li:not(:only-child) .circle--clone--remove", function () {
        var parent = $(this).parent("li");
        parent.remove();
    });

    // Adds class to selected item
    $(".circle--pill--list a").click(function () {
        $(".circle--pill--list a").removeClass("selected");
        $(this).addClass("selected");
    });

    // Adds class to parent div of select menu
    $(".circle--select select").focus(function () {
        $(this).parent().addClass("focus");
    }).blur(function () {
        $(this).parent().removeClass("focus");
    });

    // Clickable table row
    $(".clickable-row").click(function () {
        var link = $(this).data("href");
        var target = $(this).data("target");

        if ($(this).attr("data-target")) {
            window.open(link, target);
        }
        else {
            window.open(link, "_self");
        }
    });

    // Custom file inputs
    var input = $(".circle--input--file");
    var text = input.data("text");
    var state = input.data("state");
    input.wrap(function () {
        return "<a class='button " + state + "'>" + text + "</div>";
    });

    // Check for loaded scripts
    function findScript(scriptName) {
        var scripts = $("script").map(function () {
            return this.src;
        }).get();

        for (i = 0; i < scripts.length; i++) {
            if (scripts[i].indexOf(scriptName) !== -1) {
                return true;
            }
        }

        return false;
    }

    // Password strength meter
    if (findScript("password")) {
        $('.form-group #id_password1').password({
            minimumLength: 14,
            username: $("input#id_username"),
            firstName: $("input#id_first_name"),
            lastName: $("input#id_last_name")
        });
        $('.form-group #id_new_password1').password({
            minimumLength: 14
        });
    }

    // Combodate picker
    if (findScript("combodate")) {
        $('#id_birth_date').combodate();
    }

    // Remove html from bio updates.
    var $bioEntry = $("textarea#id_bio");
    var cleanBioRegex = /(<([^>]+)>)/ig

    $bioEntry.focusout(function () {
        var cleanedBioText = $bioEntry.val().replace(cleanBioRegex, "");
        $bioEntry.val(cleanedBioText);
    })
});