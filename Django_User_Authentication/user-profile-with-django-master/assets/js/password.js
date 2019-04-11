/**
 * @author Òscar Casajuana a.k.a. elboletaire <elboletaire at underave dot net>
 * @link https://github.com/elboletaire/password-strength-meter
 *
 * Using customizations added by Jordan Hoover
 *
 */
;(function ($) {
    'use strict';

    var Password = function ($object, options) {
        var defaults = {
            shortPass: 'The password is too short',
            badPass: 'Weak; try combining letters & numbers',
            goodPass: 'Medium; try using special charecters',
            strongPass: 'Strong password',
            containsUsername: 'The password contains the username, first name, or last name',
            noNumberOrSpecial: 'The password must contain 1 special character and 1 number',
            noUpperAndLower: 'The password must contain a lower and uppercase letter',
            enterPass: 'Type your password',
            showPercent: false,
            showText: true,
            animate: true,
            animateSpeed: 'fast',
            username: false,
            firstName: false,
            lastName: false,
            usernamePartialMatch: true,
            minimumLength: 4
        };

        options = $.extend({}, defaults, options);

        /**
         * Returns strings based on the score given.
         *
         * @param score int Score base.
         * @return string
         */
        function scoreText(score) {
            if (score === -1) {
                return options.shortPass;
            }
            if (score === -2) {
                return options.containsUsername;
            }
            if (score === 6) {
                return options.noUpperAndLower;
            }
            if (score === 16) {
                return options.noNumberOrSpecial;
            }

            score = score < 0 ? 0 : score;

            if (score < 34) {
                return options.badPass;
            }
            if (score < 68) {
                return options.goodPass;
            }

            return options.strongPass;
        }

        /**
         * Returns a value between -2 and 100 to score
         * the user's password.
         *
         * @param  password string The password to be checked.
         * @param  username string The username set (if options.username).
         * @param  firstName string The firstName set (if options.firstName).
         * @param  lastName string The lastName set (if options.lastName).
         * @return int
         */
        function calculateScore(password, username, firstName, lastName) {
            var score = 0;

            // password < options.minimumLength
            if (password.length < options.minimumLength) {
                return -1;
            }

            // Check against user's names if provided
            if (options.username) {
                if (isNameInPassword(options.username.val(), password, options.usernamePartialMatch)) {
                    return -2;
                }
            }
            if (options.firstName) {
                if (isNameInPassword(options.firstName.val(), password, true)) {
                    return -2;
                }
            }
            if (options.lastName) {
                if (isNameInPassword(options.lastName.val(), password, true)) {
                    return -2;
                }
            }

            // password length
            score += password.length * 4;
            score += checkRepetition(1, password).length - password.length;
            score += checkRepetition(2, password).length - password.length;
            score += checkRepetition(3, password).length - password.length;
            score += checkRepetition(4, password).length - password.length;

            // password has Upper and Lower chars
            if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
                score += 10;
            } else {
                return 6;
            }

            // password has at least one number and one symbol
            if (password.match(/([!,@#$%^&*?_~])/) && password.match(/([0-9])/)) {
                score += 15;
            } else {
                return 16;
            }


            // password has 3 numbers
            if (password.match(/((.*[0-9])\2\2)/)) {
                score += 5;
            }

            // password has at least 2 symbols
            var symbols = '.*[!,@,#,$,%,^,&,*,?,_,~]';
            symbols = new RegExp('(' + symbols + symbols + ')');
            if (password.match(symbols)) {
                score += 5;
            }

            // password has number and chars
            if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) {
                score += 15;
            }

            // password has char and symbol
            if (password.match(/([!,@#$%^&*?_~])/) && password.match(/([a-zA-Z])/)) {
                score += 15;
            }

            // password is just numbers or chars
            if (password.match(/^\w+$/) || password.match(/^\d+$/)) {
                score -= 10;
            }

            if (score > 100) {
                score = 100;
            }

            if (score < 0) {
                score = 0;
            }

            return score;
        }

        /**
         * Checks for repetition of characters in
         * a string
         *
         * @param rLen int Repetition length.
         * @param str string The string to be checked.
         * @return string
         */
        function checkRepetition(rLen, str) {
            var res = "", repeated = false;
            for (var i = 0; i < str.length; i++) {
                repeated = true;
                for (var j = 0; j < rLen && (j + i + rLen) < str.length; j++) {
                    repeated = repeated && (str.charAt(j + i) === str.charAt(j + i + rLen));
                }
                if (j < rLen) {
                    repeated = false;
                }
                if (repeated) {
                    i += rLen - 1;
                    repeated = false;
                }
                else {
                    res += str.charAt(i);
                }
            }
            return res;
        }

        /**
         * Initializes the plugin creating and binding the
         * required layers and events.
         *
         * @return mixed
         */
        function init() {
            var shown = true;
            var $text = options.showText;
            var $percentage = options.showPercent;
            var $graybar = $('<div>').addClass('pass-graybar');
            var $colorbar = $('<div>').addClass('pass-colorbar');
            var $insert = $('<div>').addClass('pass-wrapper').append(
                $graybar.append($colorbar)
            );

            $object.parent().addClass('pass-strength-visible');
            if (options.animate) {
                $insert.css('display', 'none');
                shown = false;
                $object.parent().removeClass('pass-strength-visible');
            }

            if (options.showPercent) {
                $percentage = $('<span>').addClass('pass-percent').text('0%');
                $insert.append($percentage);
            }

            if (options.showText) {
                $text = $('<span>').addClass('pass-text').html(options.enterPass);
                $insert.append($text);
            }

            $object.after($insert);

            $object.keyup(function () {
                var username = options.username || '';
                if (username) {
                    username = $(username).val();
                }

                var firstName = options.firstName || '';
                if (firstName) {
                    firstName = $(firstName).val();
                }

                var lastName = options.lastName || '';
                if (lastName) {
                    lastName = $(lastName).val();
                }

                var score = calculateScore($object.val(), username, firstName, lastName);
                $object.trigger('password.score', [score]);
                var perc = score < 0 ? 0 : score;
                $colorbar.css({
                    backgroundPosition: "0px -" + perc + "px",
                    width: perc + '%'
                });

                if (options.showPercent) {
                    $percentage.html(perc + '%');
                }

                if (options.showText) {
                    var text = scoreText(score);
                    if (!$object.val().length && score <= 0) {
                        text = options.enterPass;
                    }

                    if ($text.html() !== $('<div>').html(text).html()) {
                        $text.html(text);
                        $object.trigger('password.text', [text, score]);
                    }
                }
            });

            if (options.animate) {
                $object.focus(function () {
                    if (!shown) {
                        $insert.slideDown(options.animateSpeed, function () {
                            shown = true;
                            $object.parent().addClass('pass-strength-visible');
                        });
                    }
                });

                $object.blur(function () {
                    if (!$object.val().length && shown) {
                        $insert.slideUp(options.animateSpeed, function () {
                            shown = false;
                            $object.parent().removeClass('pass-strength-visible')
                        });
                    }
                });
            }

            return this;
        }

        return init.call(this);
    };

    function isNameInPassword(nameParam, password) {
        var partialMatch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        if (password.toLowerCase() === nameParam.toLowerCase()) {
            return true;
        }
        if (partialMatch && nameParam.length) {
            var user = new RegExp(nameParam.toLowerCase());
            if (password.toLowerCase().match(user)) {
                return true;
            }
        }

        return false;
    }

    // Bind to jquery
    $.fn.password = function (options) {
        return this.each(function () {
            new Password($(this), options);
        });
    };
})(jQuery);
