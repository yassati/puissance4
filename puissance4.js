(function ($) {
    $.fn.puissance4 = function () {
        class Puissance4 {
            constructor(selector) {
                this.selector = selector;
                this.nb_x = 0;
                this.nb_y = 0;
                this.player = 'red';

                $("body").append("<br><div class='btn'><input id='x'><input id='y'><button type='submit' id='go'>go</button></div>");
                $("body").append("<div id=\"back\"></div>");
                $("body").append("<div id=\"front\"></div>");
                $("body").append("<button id='restart' style='visibility: hidden'>replay</button>");
                $("body").append("<br><p class='yassine'>created by yassine</p>");

                $('#go').click(this.grille.bind(this));

            }

            grille() {
                $('#puissance4').remove();

                $("body").prepend("<div id='puissance4'></div>");
                $("body").prepend("<h4 class='play'><span id='player'>Joueur RED a vous !!</span></h4>");
                const $board = $(this.selector);
                this.nb_x = $('#x').val();
                this.nb_y = $('#y').val();
                if (this.nb_x > 3 && this.nb_y > 3) {
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
                        $board.append($row);
                    }

                    this.setupEventListeners();
                    this.isGameOver = false;
                } else {
                    alert("IL FAUT MINIMUM 4 CASES !!");
                }
            }

            setupEventListeners() {
                this.isGameOver = false;
                const $board = $(this.selector);
                const that = this;

                function findLastEmptyCell(col) {
                    const cells = $(`.col[data-col='${col}']`);
                    for (let i = cells.length - 1; i >= 0; i--) {
                        const $cell = $(cells[i]);
                        if ($cell.hasClass('empty')) {
                            return $cell;
                        }
                    }
                    return null;
                }

                $board.on('mouseenter', '.col.empty', function () {
                    if (that.isGameOver) return;
                    const col = $(this).data('col');
                    const $lastEmptyCell = findLastEmptyCell(col);
                    $lastEmptyCell.addClass(`next-${that.player}`);
                });

                $board.on('mouseleave', '.col', function () {
                    $('.col').removeClass(`next-${that.player}`);
                });

                $board.on('click', '.col.empty', function () {

                    if (that.isGameOver) return;
                    const col = $(this).data('col');
                    const $lastEmptyCell = findLastEmptyCell(col);
                    $lastEmptyCell.removeClass(`empty next-${that.player}`);
                    $lastEmptyCell.addClass(that.player);
                    $lastEmptyCell.data('player', that.player);
                    let son = new Audio('comlo.mp3');
                    son.play();
                    const clr = that.player;

                    const winner = that.checkForWinner(
                        $lastEmptyCell.data('row'),
                        $lastEmptyCell.data('col')
                    );

                    if (winner) {
                        const that = this;
                        that.isGameOver = true;
                        $board.prepend('GAME OVER !! ' + clr.toUpperCase() + ' A GAGNE ... ');
                        let son1 = new Audio('GO.mp3');
                        son1.play();
                        $('.col.empty').removeClass('empty');
                        $('#restart').css('visibility','visible');
                        $('#puissance4').css('pointer-events','none');
                        return;
                    }

                    that.player = (that.player === 'red') ? 'yellow' : 'red';
                    $('#player').text("joueur " + that.player.toUpperCase() + " a vous !!");

                    $(this).trigger('mouseenter');

                });
            }
            checkForWinner(row, col) {
                const that = this;

                function $getCell(i, j) {
                    return $(`.col[data-row='${i}'][data-col='${j}']`);
                }

                function checkDirection(direction) {
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
                        checkDirection(x) +
                        checkDirection(y);
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
                $('#puissance4').empty();
                $('#puissance4').css('pointer-events','');
                $('.play').remove();
                puissance4.grille();
                $('#restart').css('visibility','hidden')

            })
        });
    }
})(jQuery);
$("#puissace4").puissance4();
