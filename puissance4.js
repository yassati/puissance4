(function ($) {
    $.fn.puissance4 = function () {
        class Puissance4 {
            constructor(selector) {
                this.selector = selector;
                this.nb_x = 0;
                this.nb_y = 0;
                this.player = 'red';

                $("header").append("<h1 id='titre'>PUISSANCE 4</h1>");
                $("body").append("<br><div class='btn'><input id='x' value='6'><input value='7' id='y'><button type='submit' id='go'>go</button></div>");
                $("body").append("<div id=\"back\"></div>");
                $("body").append("<div id=\"front\"></div>");
                $("body").append("<button id='restart' style='visibility: hidden'>replay</button>");
                $("body").append("<button type='button' id='mode'><a class='reg' href='https://www.regles-de-jeux.com/regle-du-puissance-4/' target=\"_blank\">regeles de jeu</a></button>");
                $("body").append("<br><p class='yassine'>Copyright © 2019 Yassine Elati</p>");
                $('#go').click(this.grille.bind(this));
                document.onkeydown = function replay (e) {
                    var key = e.keyCode;
                    if(key===32){
                        this.grille.bind(this)
                    }

                };
                $('#go').click(function () {
                });
            }

            grille() {
                $('#puissance4').remove();
                $("body").prepend("<div id='puissance4'></div>");
                $("body").prepend("<h6 class='ml6' id='win'></h6>");
                $("body").prepend("<h3 class='play'><span id='player'>Joueur RED a vous !!</span></h3>");
                $("body").prepend("<div class='result'><div class='scorered'><p> RED : <span class='countRed'>0</span></p></div> <div class='secoreyellow'><p>YELLOW : <span class='countYellow'>0</span></p></div></div>");
                const grille = $(this.selector);
                this.nb_x = $('#x').val();
                this.nb_y = $('#y').val();
                if (this.nb_x > 3 && this.nb_y > 3 && this.nb_x < 15 && this.nb_y < 15) {
                    for (let row = 0; row < this.nb_x; row++) {
                        const $row = $('<div>')
                            .addClass('row');
                        for (let col = 0; col < this.nb_y; col++) {
                            const $col = $('<div>')
                                .addClass('col empty')
                                .attr('data-col', col)
                                .attr('data-row', row);
                            $row.append($col);
                        }
                        grille.append($row);
                    }

                    this.placerPions();
                    this.victoire = false;
                    $('.btn').css('visibility','hidden');
                    $('#mode').css('visibility','visible');
                    $('header').remove()
                }
                else {
                    alert("IL FAUT MINIMUM 4 CASES ET MAXIMUM 15 !!");
                    $('.result').css('visibility','hidden');
                    $('.play').css('visibility','hidden');


                }
            }

            placerPions() {
                var scoreRed =0;
                var scoreYellow =0;
                var red ='red';
                var yellow ='yellow';
                this.victoire = false;
                const grille = $(this.selector);
                const that = this;

                function recupLastEmpty(col) {
                    const cells = $(`.col[data-col='${col}']`);
                    for (let i = cells.length - 1; i >= 0; i--) {
                        const $cell = $(cells[i]);
                        if ($cell.hasClass('empty')) {
                            return $cell;
                        }
                    }
                    return null;
                }

                grille.on('mouseenter', '.col.empty', function () {
                    if (that.victoire) return;
                    const col = $(this).data('col');
                    const dernierVide = recupLastEmpty(col);
                    dernierVide.addClass(`next-${that.player}`);
                });

                grille.on('mouseleave', '.col', function () {
                    $('.col').removeClass(`next-${that.player}`);
                });

                grille.on('click', '.col.empty', function () {

                    if (that.victoire) return;
                    const col = $(this).data('col');
                    const dernierVide = recupLastEmpty(col);
                    dernierVide.removeClass(`empty next-${that.player}`);
                    dernierVide.addClass(that.player);
                    dernierVide.data('player', that.player);
                    let son = new Audio('comlo.mp3');
                    son.play();
                    const clr = that.player;

                    const winner = that.verifVictoire(
                        dernierVide.data('row'),
                        dernierVide.data('col')
                    );

                    if (winner) {
                        const that = this;
                        that.victoire = true;
                        $('#win').text('GAME OVER !! ' + clr.toUpperCase() + ' A GAGNE ... ');
                        let son1 = new Audio('GO.mp3');
                        son1.play();
                        $('.col.empty').removeClass('empty');
                        $('#restart').css('visibility','visible');
                        $('#puissance4').css('pointer-events','none');
                        if(winner=== red){
                            scoreRed++;
                            console.log(scoreRed);
                            $('.countRed').text(scoreRed);
                        }
                        else if(winner=== yellow){
                            scoreYellow++;
                            console.log(scoreYellow);
                            $('.countYellow').text(scoreYellow);
                        }
                        return;
                    }

                    that.player = (that.player === 'red') ? 'yellow' : 'red';
                    $('#player').text("joueur " + that.player.toUpperCase() + " a vous !!");


                    $(this).trigger('mouseenter');

                    $('.ml6 .letters').each(function(){
                        $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
                    });

                    anime.timeline({loop: true})
                        .add({
                            targets: '.ml6 .letter',
                            translateY: ["1.1em", 0],
                            translateZ: 0,
                            duration: 750,
                            delay: function(el, i) {
                                return 50 * i;
                            }
                        }).add({
                        targets: '.ml6',
                        opacity: 0,
                        duration: 1000,
                        easing: "easeOutExpo",
                        delay: 1000
                    });

                });
            }
            verifVictoire(row, col) {
                const that = this;

                function $getCell(i, j) {
                    return $(`.col[data-row='${i}'][data-col='${j}']`);
                }

                function verifDirection(direction) {
                    let total = 0;
                    let i = row + direction.i;
                    let j = col + direction.j;
                    let $next = $getCell(i, j);
                    while (i >= 0 && i < that.nb_x && j >= 0 && j < that.nb_y && $next.data('player') === that.player) {
                        total++;
                        i += direction.i;
                        j += direction.j;
                        $next = $getCell(i, j);
                    }

                    return total;
                }

                function verifWin(x, y) {
                    const total = 1 +
                        verifDirection(x) +
                        verifDirection(y);
                    if (total >= 4) {
                        return that.player;
                    } else {
                        return null;
                    }
                }

                function diago1() {
                    return verifWin({i: 1, j: -1}, {i: 1, j: 1});
                }

                function diago2() {
                    return verifWin({i: 1, j: 1}, {i: -1, j: -1});
                }

                function verti() {
                    return verifWin({i: -1, j: 0}, {i: 1, j: 0});
                }

                function hori() {
                    return verifWin({i: 0, j: -1}, {i: 0, j: 1});
                }

                return verti() || hori() || diago1() || diago2();
            }
        }
        $(document).ready(function () {
            const puissance4 = new Puissance4('#puissance4');
            $('#restart').on('click',function () {
                $('#puissance4').removeClass('red');
                $('#puissance4').removeClass('yellow');
                $('#puissance4').css('pointer-events','');
                $('.play').remove();
                $('.ml6').remove();
                $('.result').remove();
                puissance4.grille();
                $('#restart').css('visibility','hidden');

            });
            document.onkeydown = function replay (e) {
                var key = e.keyCode;
                if (key === 32) {
                    $('#puissance4').removeClass('red');
                    $('#puissance4').removeClass('yellow');
                    $('#puissance4').css('pointer-events', '');
                    $('.play').remove();
                    $('.ml6').remove();
                    $('.result').remove();
                    puissance4.grille();
                    $('#restart').css('visibility', 'hidden');
                }

            };
        });
    }
})(jQuery);
$("#puissace4").puissance4();
