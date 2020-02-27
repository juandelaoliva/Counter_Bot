const Telegraf = require('telegraf');
const {
    Extra,
    Markup
} = require('telegraf');

const config = require('./config');
const dataService = require('./dataService');
const graphs = require('./graphs.js');
const gifs = require('./gifs.js');


var _ = require('lodash');

dataService.loadUsers();

const bot = new Telegraf(config.botToken);

const initMsg = `💩 Bienvenido al Cagómetro 💩 este bot te ayudará a contar cuántas cacas haces de una manera muy sencilla. 

Todos los comandos necesarios los encontrarás en los botones del menú (si no encuentras los botones al lado del símbolo de los emojis puedes forzar su apariciónn mediante el comando /MenuPrincipal)

Para más informaciónn puedes ejecutar el comando /Ayuda 
`;

const helpMsg = `💩Comandos de referencia:💩

/start - Iniciar bot
/SumaCaca - Aumenta en una unidad tu contador de caca
/Ranking - Muestra las cacas de todos
/Stats - Muestra tus estadísticas
/Graph - Muesta un gráfico anual
(Si estás en un grupo y quieres crear tu propio gráfico escribe el comando seguido de un espacio y la palabra 'propio')

/menuprincipal - Muestra los botones principales
/quitacaca - Decrementa una unidad de caca
/modificar - Cambia tus cacas a lo grande
/ayuda - Pulsa aquí si tienes dudas
/compartir - Haz que el Cagómetro vea mundo
/donar - Para seguir mejorando este proyecto

`;

const aboutMsg = "Este bot ha sido creado por @juandelaoliva utilizando el proyecto base de contador de  @LeoDJ\nCódigo fuente y datos de contacto se pueden encontrar en https://github.com/LeoDJ/telegram-counter-bot";

const nameErrMsg = "Para usar este bot es necesario tener un alias o nombre de usuario de Telegram, también puede que no hayas iniciado el bot.\n ⚠️ Al iniciar el bot todos los contadores se pondrán a cero, el comando necesario para iniciar es start (con una barra delante '/')";
const ErrMsg = "Ups! parece que algo ha ido mal intentalo más tarde o ponte en contacto con mi creador.";

function getRegExp(command) {
    return new RegExp("/" + command + "[a-z,A-Z,0-9]{0,25}\\b");
}

//get username for group command handling
bot.telegram.getMe().then((botInfo) => {
    bot.options.username = botInfo.username;
    console.log("Initialized", botInfo.username);
});



function userString(ctx) {
    return JSON.stringify(ctx.from.id == ctx.chat.id ? ctx.from : {
        from: ctx.from,
        chat: ctx.chat
    });
}

function logMsg(ctx) {
    var from = userString(ctx);
    console.log('<', ctx.message.text, from)
}

function logOutMsg(ctx, text) {
    console.log('>', {
        id: ctx.chat.id
    }, text);
}


//---------------------------------------------MENU---------------------------------------------------------------

const menuPrincipal = Markup
    .keyboard([
        ['/SumaCaca'],
        ['/Ranking', '/Stats', '/Graph'] // Row3 with 3 buttons
    ])
    .oneTime()
    .resize()
    .extra()


bot.command('menuprincipal', ctx => ctx.reply('💩 Menú Principal 💩', menuPrincipal))
bot.command('donar', ctx => ctx.reply('💩💰 Puedes donar al proyecto mediante este link de Paypal 💩\n\n   paypal.me/juandelaoliva'))
bot.command('compartir', ctx => ctx.reply('💩 Puedes compartir este bot mediante el siguiente link 💩\n\n   telegram.me/cgmtr_bot'))


//---------------------------------------------RESPUESTAS AUTOMÁTICAS---------------------------------------------------------------

bot.hears(/caga/i, (ctx) => ctx.reply("💩 ¿Verbo cagar? 💩\n\n Vulgar pero efectivo, aun así te doy nunevas ideas para decir que vas al baño: \n\n '" + gifs.getRandomSentence() + "'"));
bot.hears(/cago/i, (ctx) => ctx.reply("💩 ¿Verbo cagar? 💩\n\n Vulgar pero efectivo, aun así te doy nunevas ideas para decir que vas al baño: \n\n '" + gifs.getRandomSentence() + "'"));
bot.hears(/mierda/i, (ctx) => ctx.reply("💩 mierda? vamos allá! 💩"));
bot.hears(/peste/i, (ctx) => ctx.reply("💩 jejeje ha dicho peste 💩"));
bot.hears(/Guille/i, (ctx) => ctx.reply("💩 Cómeme las pelotas Guille 💩"));
bot.hears(/(^caca)|(\Wcaca)/, (ctx) => ctx.reply("💩 ¿Has dicho 'caca'? 💩 \n\n Aquí te dejo una manera distinta para decir que vas a cagar:\n\n '" + gifs.getRandomSentence() + "'"));
bot.hears(/(^Caca)|(\WCaca)/, (ctx) => ctx.reply("💩 ¿Has dicho 'caca'? 💩 \n\n Aquí te dejo una manera distinta para decir que vas a cagar:\n\n '" + gifs.getRandomSentence() + "'"));
bot.hears('gif', (ctx) => ctx.replyWithAnimation(gifs.getRandomGif()));





//---------------------------------------------COMANDOS---------------------------------------------------------------

bot.command('modificar', (ctx) => {
    return ctx.reply('🔧 💩 Modifica tu número de cacas a lo grande! 💩', Extra.HTML().markup((m) =>
        m.inlineKeyboard([
            m.callbackButton('-100', -100),
            m.callbackButton('-10', -10),
            m.callbackButton('-5', -5),
            m.callbackButton('+5', 5),
            m.callbackButton('+10', 10),
            m.callbackButton('+100', 100)
        ])))
})


bot.on('callback_query', (ctx) => {
    try {
        var from = userString(ctx);
        var newData = JSON.parse(from).username;
        if (newData == null) {
            newData = (JSON.parse(from).from.username);
        }
        if (newData == null) {
            throw TypeError;
        }
        var counterId = newData || 0;

        var val = +dataService.getCounter(ctx.chat.id, counterId);
        var delta = parseInt(ctx.callbackQuery.data);


        val = val + delta;
        if (val < 0) {
            val = 0;
        }
        dataService.setCounter(ctx.chat.id, counterId, val);

        var printCounterId = counterId ? "[" + counterId + "] " : "";
        val = printCounterId + val + " 💩";

        console.log(ctx.callbackQuery.data)
        logOutMsg(ctx, val);
        ctx.reply(val);
        ctx.answerCbQuery(ctx.callbackQuery.data, "recibido!")
    } catch (e) {
        if (e instanceof TypeError) {
            ctx.reply(nameErrMsg);
        }
    }
})



bot.command('start', ctx => {
    logMsg(ctx);
    dataService.registerUser(ctx);
    ctx.reply(initMsg);

    setTimeout(() => {
        ctx.reply("💩 Usa los botones para gestionar tus cacas! 💩", menuPrincipal);
    }, 50);  //delay para enviar este mensaje como segundo mensaje
});

bot.command('stop', ctx => {
    logMsg(ctx);
    var m = "💩 Lo siento mucho, pero no puedo hacer eso. 💩";
    logOutMsg(ctx, m);
    ctx.reply(m);
});


bot.command('ayuda', ctx => {
    logMsg(ctx);
    logOutMsg(ctx, helpMsg);
    ctx.reply(helpMsg);
});

bot.command('about', ctx => {
    logMsg(ctx);
    //logOutMsg(ctx, aboutMsg);
    ctx.reply(aboutMsg);
});


bot.command(('Ranking'), ctx => {
    logMsg(ctx);
    // Cogemos todos los contadores del chat
    //counters = dataService.getAllCounters(ctx.chat.id);
   var counters;
    if (counters == null) {
        ctx.reply("🥇 💩 Nadie ha registrado ninguna caca todavía 💩")
    } else {
        // Inicio del mensaje de respuesta
        msg = "🥇Ranking🥇 \n\n";

        // Guardamos los valores de cada contador
        var values = [];
        Object.keys(counters).forEach(counterId => {
            values.push(counters[counterId]);
        });

        // Ordenamos los valores y le damos la vuelta
        sortedValues = values.sort(function (a, b) { return a - b });
        sortedValues.reverse();
        // borramos los valores repetidos ya que estarán agrupados
        var uniqueSortedValues = _.uniq(sortedValues);

        // Le damos la vuelta (key/values) a los conntadores para poder buscar luego por orden        
        var reversedCounters = _.invertBy(counters);

        // Por cada valor en orden buscamos en el JSON de los contadores a quién pertenece cada puntuación
        for (i = 0; i < uniqueSortedValues.length; i++) {
            if (uniqueSortedValues.length > 1 && i == 0) {
                msg += ' 👑' + reversedCounters[uniqueSortedValues[i]] + ': ' + uniqueSortedValues[i] + " 💩" + "\n\n";

            } else {
                msg += reversedCounters[uniqueSortedValues[i]] + ': ' + uniqueSortedValues[i] + " 💩" + "\n";
            }
        }
        logOutMsg(ctx, msg);
        ctx.reply(msg);
    }
});




bot.command(('SumaCaca'), ctx => {
    try {

        var from = userString(ctx);
        // Comprobamos si el mensaje viene de un grupo o de un chat privado
        var counterId = JSON.parse(from).username;
        if (counterId == null) {
            counterId = (JSON.parse(from).from.username);
        }
        if (counterId == null) {
            throw TypeError;
        } else {
            var val = dataService.getCounter(ctx.chat.id, counterId);
            val++;
            dataService.setCounter(ctx.chat.id, counterId, val);

            var printCounterId = counterId ? "[" + counterId + "] " : "";
            if (val != 0 && val % 50 == 0 && val != 100) {
                var res = "💩 Enhorabuena " + counterId + "! 💩\n\nHas llegado a la gran cifra de las " + val + " cacas. Sigue esforzándote así y llegarás muy lejos!";
                setTimeout(() => {
                    ctx.replyWithAnimation(gifs.getRandomGif());
                    logOutMsg(ctx, 0)
                }, 50);
            } else if (val == 100) {
                var res = "💩 Joder " + counterId + " ya te tiene que arder el ojete! 💩\n\nHas llegado a la gran cifra de las 100 cacas. Llegarás al cielo con tu mierda!";
                setTimeout(() => {
                    ctx.replyWithAnimation(gifs.getRandomGif());
                    logOutMsg(ctx, 0)
                }, 50);
            } else {
                var res = printCounterId + val + " 💩";
            }

        }

        logOutMsg(ctx, res);
        ctx.reply(res);

    } catch (e) {
        if (e instanceof TypeError) {
            ctx.reply(nameErrMsg);
        }
    }



});

bot.command(('quitacaca'), ctx => {
    try {
        var from = userString(ctx);
        var counterId = JSON.parse(from).username;
        if (counterId == null) {
            counterId = (JSON.parse(from).from.username);
        }
        if (counterId == null) {
            throw TypeError;
        }

        var val = dataService.getCounter(ctx.chat.id, counterId);
        val--;
        if (val < 0) {
            val = 0;
        }
        dataService.setCounter(ctx.chat.id, counterId, val);

        var printCounterId = counterId ? "[" + counterId + "] " : "";

        val = printCounterId + val + " 💩";
        logOutMsg(ctx, val);
        ctx.reply(val);
    } catch (e) {
        if (e instanceof TypeError) {
            ctx.reply(nameErrMsg);
        }
    }
});

// este comando solo está disponible para el dueño del bot
bot.command('broadcast', ctx => {
    if (ctx.from.id == config.adminChatId) {
        var words = ctx.message.text.split(' ');
        words.shift(); //borramos la primera palabra  (que es "/broadcast")
        if (words.length == 0) //Evitamos mandar mensajes vacíos
            return;
        var broadcastMessage = words.join(' ');
        var userList = dataService.getUserList();
        console.log("Sending broadcast message to", userList.length, "users:  ", broadcastMessage);
        userList.forEach(userId => {
            console.log(">", { id: userId }, broadcastMessage);
            ctx.telegram.sendMessage(userId, broadcastMessage);
        });
    }
});


//---------------------------------------------Estadísticas---------------------------------------------------------------


bot.command(('Stats'), ctx => {
    try {
        var from = userString(ctx);

        var newData = JSON.parse(from).username;
        if (newData == null) {
            newData = (JSON.parse(from).from.username);
        }
        if (newData == null) {
            throw TypeError;
        } else {

            stats = dataService.getStats(ctx.chat.id, newData);

            if (stats.length > 0) {

                var today = new Date();
                today = today.setHours(today.getHours() + 1);
                today = new Date(today);


                var thisDay = today.getDate();
                var thisYear = today.getFullYear();
                var lastYear = thisYear - 1;
                var thisMonth = today.getMonth() + 1;

                if (thisMonth == 1) {
                    var lastMonth = 12;
                } else {
                    var lastMonth = thisMonth - 1;
                }


                var cacasToday = 0;
                var cacasYesterday = 0;

                var cacasThisMonth = 0;
                var cacasLastMonth = 0;

                var mediaThisMonth = 0;
                var mediaLastMonth = 0;

                var mediaThisYear = 0;
                var mediaLastYear = 0;

                var cacasThisYear = 0;
                var cacasLastYear = 0;


                for (var i = 0; i < stats.length; i++) {
                    var logDate = new Date(stats[i]);

                    var logYear = logDate.getFullYear();
                    var logMonth = logDate.getMonth() + 1;
                    var logDay = logDate.getDate();

                    if (logYear == thisYear) {
                        cacasThisYear += 1;
                    }
                    if (logYear == lastYear) {
                        cacasLastYear += 1;
                    }

                    if (logYear == thisYear && logMonth == thisMonth) {
                        cacasThisMonth += 1;
                    }

                    if (logYear == thisYear && logMonth == lastMonth && lastMonth != 12) {
                        cacasLastMonth += 1;
                    }

                    if (logYear == lastYear && logMonth == lastMonth && lastMonth == 12) {
                        cacasLastMonth += 1;
                    }

                    if (logYear == thisYear && logMonth == thisMonth && logDay == thisDay) {
                        cacasToday += 1;
                    }

                }


                //calculamos si este año es bisiesto o no
                // var bisiesto = false;
                // if (thisYear % 400 == 0 || (thisYear % 4 == 0 && thisYear % 100 != 0)) {
                //     bisiesto = true;
                //     mediaThisYear = cacasThisYear / 366;
                // } else {
                //     bisiesto = false;
                //     mediaThisYear = cacasThisYear / 365;
                // }

                mediaThisYear = cacasThisYear / calculaNumeroDia();



                mediaThisMonth = cacasThisMonth / thisDay;
                mediaLastMonth = calculaMediaMes(lastMonth, cacasLastMonth);

                var diferenciaConMesPasado;
                if (mediaLastMonth != 0) {
                    diferenciaConMesPasado = ((mediaThisMonth / mediaLastMonth) * 100) - 100;
                }

                //Checking hours


                var res = '💩 Estadísticas de ' + newData + ' 💩\n';
                res += '(Hoy: ' + thisDay + '/' + thisMonth + '/' + thisYear + ')\n\n';
                res += '- Hoy has cagado ' + cacasToday;
                cacasToday == 1 ? res += ' vez.\n' : res += ' veces.\n';
                res += '- Este mes has cagado ' + cacasThisMonth;
                cacasThisMonth == 1 ? res += ' vez.\n' : res += ' veces.\n';
                res += '- Este año has cagado ' + cacasThisYear;
                cacasThisYear == 1 ? res += ' vez.\n\n' : res += ' veces.\n\n';
                res += '- Este año llevas una media de ' + mediaThisYear.toFixed(4) + ' cacas al día.\n';
                res += '- Este mes llevas una media de ' + mediaThisMonth.toFixed(4) + ' cacas al día';

                if (diferenciaConMesPasado) {
                    res += ' que es un ' + Math.abs(diferenciaConMesPasado).toFixed(2) + '%';
                    if (diferenciaConMesPasado >= 0) {
                        res += ' más';
                    } else if (diferenciaConMesPasado < 0) {
                        res += ' menos';
                    }
                    res += ' que el mes pasado';
                }

                ctx.reply(res);


                if (newData == 'TimelNegro'){
                    setTimeout(() => {
                        ctx.reply("💩 Guille estas estadísticas pueden ser útiles, o no, depende de como se mire. Por un lado el conocimiento es poder, pero por otro lado, los ignorantes son más felices. En fin Guille, que me comas las pelotas. 💩");
                    }, 90);  //delay para enviar este mensaje como segundo mensaje
                }
            } else {
                ctx.reply('Ninguna estadística disponible');
            }
        }
    }
    catch (e) {
        if (e instanceof TypeError) {
            ctx.reply(nameErrMsg);
            console.log(e);
        }
    }
});

function calculaMediaMes(month, cacasMonth) {
    //estadísticas por mes
    var mediaMonth = 0;
    // Primero tratamos febrero por ser especial
    if (month == 2) {
        if (bisiesto) {
            mediaMonth = cacasMonth / 29;
        } else {
            mediaMonth = cacasMonth / 28;
        }
        // ahora el resto de meses hasta Julio
    } else if (month != 2 && month < 8) {
        if (month % 2 == 0) {
            mediaMonth = cacasMonth / 30;
        } else {
            mediaMonth = cacasMonth / 31;
        }
        // de Agosto a Diciembre
    } else if (month >= 8) {
        if (month % 2 == 0) {
            mediaMonth = cacasMonth / 31;
        } else {
            mediaMonth = cacasMonth / 30;
        }
    }

    return mediaMonth;
}

function calculaNumeroDia() {
    var now = new Date();
    now = now.setHours(now.getHours() + 1);
    now = new Date(now);
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return day;
}

bot.startPolling();



bot.command(('Graph'), ctx => {
    try {
        var from = userString(ctx);

        var newData = JSON.parse(from).username;
        if (newData == null) {
            newData = (JSON.parse(from).from.username);
        }
        if (newData == null) {
            throw TypeError;
        } else {
            var graph;
            if (ctx.chat.type == 'group') {

                var words = ctx.message.text.split(' ');
                words.shift(); //borramos la primera palabra  (que es la llamada al comando)

                if (words[0] == 'propio') {
                    history = dataService.getHistory(ctx.chat.id, newData);
                    graph = graphs.generateYearGraph(history, newData);
                    ctx.replyWithPhoto(graph);
                } else {
                    graph = graphs.getGroupGraph2(ctx.chat.id);
                    ctx.replyWithPhoto(graph);
                }

            } else {
                history = dataService.getHistory(ctx.chat.id, newData);
                graph = graphs.generateYearGraph(history, newData);
                ctx.replyWithPhoto(graph);

            }
        }

        logOutMsg(ctx, newData + ': Graph generated');
    }
    catch (e) {
        if (e instanceof TypeError) {
            ctx.reply(ErrMsg);
            console.log(e);
        }
    }
});




module.exports = {

}