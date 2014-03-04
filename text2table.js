var text2table = (function () {
    'use strict';
    var regex, input = null, output = '',
        data = {
            expression: '[\t|]+',
            modifier: 'g',
            separator: '\t | \t',
            style: {
                'hor': '-',
                'ver': '|',
                'tl': '+',
                'tm': '+',
                'tr': '+',
                'ml': '+',
                'mm': '+',
                'mr': '+',
                'bl': '+',
                'bm': '+',
                'br': '+'
            }
        },
        extend = function (target, source) {
            if (source) {
                var key, val;
                for (key in source) {
                    if (source.hasOwnProperty(key)) {
                        val = source[key];
                        if (val !== undefined) {
                            target[key] = val;
                        }
                    }
                }
            }
            return target;
        },
        initialize = function () {
            if (input === null) {
                throw 'Input is not given';
            }
            regex = new RegExp(data.expression, data.modifier);
            return true;
        },
        toTable = (function () {
            var rows, columns = [], isNumeric = [],
                regexps = {
                    rows: /[\r\n]+/,
                    spacenum: /^(\s*-?\d+\s*|\s*)$/
                },
                getRows = function () {
                    rows = input.split(new RegExp(regexps.rows));
                    return rows;
                },
                getCol = function (n) {
                    return rows[n].split(regex);
                },
                getCols = function () {
                    var i, s, col, str;
                    for (i = 0; i < rows.length; i += 1) {
                        col = getCol(i);
                        for (s = 0; s < col.length; s += 1) {
                            str = col[s];
                            if (columns[s] === undefined) {
                                isNumeric[s] = true;
                            }
                            if (isNumeric[s] && !str.match(new RegExp(regexps.spacenum)) && i !== 0) {
                                isNumeric[s] = false;
                            }
                            if (columns[s] === undefined || columns[s] < str.length) {
                                columns[s] = str.length;
                            }
                        }
                    }
                    return columns;
                },
                alignText = function (pos, chr, str, len) {
                    var more = len - str.length,
                        left = Math.floor(more / 2),
                        right = more - left;
                    chr = (chr === undefined) ? ' ' : chr;
                    pos = (pos === undefined) ? ' ' : pos;

                    if (pos === 'right') {
                        return new Array(more + 1).join(chr) + str;
                    }
                    if (pos === 'left') {
                        return str + new Array(more + 1).join(chr);
                    }
                    //center
                    return new Array(left + 1).join(chr) + str + new Array(right + 1).join(chr);
                },
                drawTop = function (i) {
                    if (i === 0) {
                        var s;
                        output += data.style.tl;
                        for (s = 0; s < columns.length; s += 1) {
                            output += new Array(columns[s] + 3).join(data.style.hor);
                            if (s < columns.length - 1) {
                                output += data.style.tm;
                            } else {
                                output += data.style.tr;
                            }
                        }
                        output += "\n";
                    }
                },
                drawHeaders = function () {
                    var s;
                    for (s = 0; s < columns.length; s += 1) {
                        output += new Array(columns[s] + 3).join(data.style.hor);
                        if (s < columns.length - 1) {
                            output += data.style.mm;
                        } else {
                            output += data.style.mr;
                        }
                    }
                },
                drawData = function (i, cols) {
                    var s, string, align;
                    for (s = 0; s < columns.length; s += 1) {
                        string = cols[s] || '';
                        align = (i === 0) ? 'center' : 'left';
                        // if (isNumeric[s] && i > 0) { align = "right"; }
                        string = alignText(align, ' ', string, columns[s]);
                        output += ' ' + string + ' ' + data.style.ver;
                    }
                },
                drawBottom = function () {
                    var s;
                    for (s = 0; s < columns.length; s += 1) {
                        output += new Array(columns[s] + 3).join(data.style.hor);
                        if (s > columns.length - 1) {
                            output += data.style.br;
                        } else {
                            output += data.style.bm;
                        }
                    }
                },
                getResult = function () {
                    var n;
                    getCols();
                    for (n = 0; n < rows.length; n += 1) {
                        drawTop(n);
                        if (n === 1) {
                            output += data.style.ml;
                            drawHeaders();
                            output += "\n";
                        }
                        output += data.style.ver;
                        drawData(n, getCol(n));
                        output += "\n";
                        if (n === rows.length - 1) {
                            output += data.style.bl;
                            drawBottom();
                        }
                    }
                };
            return {
                convert: function () {
                    if (getRows()[rows.length - 1] === '') { rows.pop(); }
                    getResult();
                    return true;
                }
            };
        }(this)),
        toText = (function () {
            var lines, separator = '', columns = [],
                regexps = {
                    all: /^\s*([\w\W]*?)\s*$/
                },
                getLines = function () {
                    lines = input.split('\n');
                },
                separates = function (l) {
                    return l.indexOf(' ') === -1;
                },
                buildSeparator = function () {
                    var i, l;
                    for (i = 0; i < lines.length; i += 1) {
                        l = lines[i];
                        if (separates(l)) {
                            separator = l;
                            return separator;
                        }
                    }
                },
                getColumns = function () {
                    var i, char, spacer = separator[1];
                    for (i = 0; i < separator.length; i += 1) {
                        char = separator[i];
                        if (char !== spacer) {
                            columns.push(i);
                        }
                    }
                },
                extract = function () {
                    getColumns();
                    var i, l, s,
                        from, to, str;
                    for (i = 0; i < lines.length; i += 1) {
                        l = lines[i];
                        if (separates(l) !== true) {
                            for (s = 0; s < columns.length - 1; s += 1) {
                                from = columns[s] + 1;
                                to = columns[s + 1];
                                str = l.slice(from, to);
                                str = str.match(new RegExp(regexps.all))[1];
                                output += str;
                                if (s < columns.length - 2) {
                                    output += data.separator;
                                }
                            }
                            if (i < lines.length - 1) {
                                output += '\n';
                            }
                        }
                    }
                };
            return {
                convert: function () {
                    getLines();
                    if (buildSeparator() === '') {
                        throw 'No separator found';
                    }
                    extract();
                    return true;
                }
            };
        }(this));
    return {
        data: function (opts) {
            extend(data, opts);
        },
        toTable: function (i) {
            input = i || null;
            if (initialize() && toTable.convert()) {
                return output;
            }
            throw 'Error occured while executing `toTable`';
        },
        toText: function (i) {
            input = i || null;
            if (initialize() && toText.convert()) {
                return output;
            }
            throw 'Error occured while execuring `toText`';
        }
    };
}());