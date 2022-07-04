const Discord = require('discord.js')
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});
const config = require('./dasha_config.json')

const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const token = config.Token
const prefix = config.Prefix
const lvlstat = require('./levels.json')
const about_me_stat = require('./about_me.json')
const serv_stat = require('./server_badges.json');
const { channel } = require('diagnostics_channel');

console.log('Даша запущена!')

//{name:'', value:''},

client.on("messageCreate", function(message) {



    client.user.setActivity('Команды: d!help')
    client.user.setStatus('dnd')



    const userstat = message.author.id; // Rank Database
    if(!lvlstat[userstat]){
        lvlstat[userstat] ={
            name:`${message.author.username}`,
            xp:0,
            level:1,
        };
    };
    let u = lvlstat[userstat];
    let partner_id = message.guild.id
    u.xp+=1;
    if(partner_id == '960553875637669898'){
        u.xp+=9
    }
    if(u.xp>= (u.level * 30)){
        u.xp = 0;
        u.level += 1;
        message.channel.send(`Поздравляю! <@${userstat}>! Ты поднялся до ${u.level} уровня!`)
    };
    fs.writeFile('./levels.json',JSON.stringify(lvlstat),(err)=>{
        if(err) console.log(err)
    })



    const about_me_id = message.author.id; // About Database
    if(!about_me_stat[about_me_id]){
        about_me_stat[about_me_id] ={
            name:`${message.author.username}`,
            about_me:'Нету информации...',
            badges:'🧒'
        };
    };
    let about_u = about_me_stat[about_me_id];
    fs.writeFile('./about_me.json',JSON.stringify(about_me_stat),(err)=>{
        if(err) console.log(err)
    })



    const server_badges_stat = message.guild.id; // Server Badges Database
    if(!serv_stat[server_badges_stat]){
        serv_stat[server_badges_stat] ={
            badges:'К сожалению, но бэйджов на этом сервере нет...'
        };
    };
    let server_u = serv_stat[server_badges_stat];
    fs.writeFile('./server_badges.json',JSON.stringify(serv_stat),(err)=>{
        if(err) console.log(err)
    })

	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;

	const commandBody = message.content.slice(prefix.length); 
  	const args = commandBody.split(' ');
  	const command = args.shift().toLowerCase();



    if(command === 'test'){
        message.reply('Тест прошел успешно!')
        console.log('Даша ответила на команду: d!test')
    }

    if(command === 'info'){
        const aboutEmbed = new MessageEmbed()
        .setColor('LUMINOUS_VIVID_PINK')
        .setTitle('Кто я такая?')
        .setDescription('[Пригласить бота!](https://discord.com/api/oauth2/authorize?client_id=985063730519867405&permissions=8&scope=bot)')
        .addFields(
            {name:'Привет!', value:'Меня зовут Даша, и я крутой бот!'},
            {name:'Кто твой создатель?', value:'мой создатель <@699227794302959648>!'},
            {name:'Версия:', value:'1.0 alpha'},
            {name:'Количество команд:', value:'18 Команд'},
            {name:'Количество серверов:', value:`${client.guilds.cache.size} Серверов`},
            {name:'Посмотреть команды:', value:'d!help'},
        )
        .setTimestamp()
        message.channel.send({embeds:[aboutEmbed]})
        console.log('Даша ответила на команду: d!about ')
    }

    if(command === 'help'){
        const helpEmbed = new MessageEmbed()
        .setColor('LUMINOUS_VIVID_PINK')
        .setTitle('Список команд!')
        .addFields(
            {name:'Развлечения:', value:'d!8ball d!hug d!punch d!slap d!coin'},
            {name:'Профиль:', value:'d!write d!profile'},
            {name:'Партнерство:', value:'d!pauth d!list'},
            {name:'Другое:', value:'d!help d!info d!server d!ping d!badges'},
        )
        .setTimestamp()
        message.channel.send({embeds:[helpEmbed]})
        console.log('Даша ответила на команду: pl!help')
    }

    if (command === 'server'){
        const members = message.guild.members.cache;
        const ServerLogo = message.guild.iconURL();
        const servinfEmbed = new MessageEmbed()
        .setColor('LUMINOUS_VIVID_PINK')
        .setThumbnail(ServerLogo)
        .setTitle(`Информация про Сервер!`)
        .addFields(
          {name: `Название:`, value: `***${message.guild.name}***`},
          {name: 'Создатель сервера:', value: `<@${message.guild.ownerId}>`},
          {name: 'Бэйджи:',value:`${server_u.badges}`},
          {name: `Количество участников:`, value: `***${message.guild.memberCount}*** участников`},
          {name: `Количество кастом эмодзи:`, value: `***${message.guild.emojis.cache.size}*** эмодзи`},
          {name: `Количество ролей:`, value: `***${message.guild.roles.cache.size}*** ролей`},
        )
        .setTimestamp()
        message.channel.send({ embeds: [servinfEmbed] })
        console.log('Даша ответила на команду: d!server')
    }

    if(command === 'profile'){
        const statMember = message.mentions.users.first()
        if(statMember){
            userstat_ping = statMember.id
            let ping_u = lvlstat[userstat_ping]
            let aboutping_u = about_me_stat[userstat_ping]
            const KD = (0.5*ping_u.level/2)
            const xpneed = ((ping_u.level*30)-ping_u.xp)
            const userRankEmbed = new MessageEmbed()
            .setColor('LUMINOUS_VIVID_PINK')
            .setTitle('Статистика выбраного человека:')
            .addFields(
                {name:'Ник:', value:`<@${statMember.id}> ${aboutping_u.badges}`},
                {name:'Инфо:', value:`${aboutping_u.about_me}`},
                {name:'Уровень:', value:`${ping_u.level} уровень`},
                {name:'Опыт:', value:`${ping_u.xp} опыта`},
                {name:'До следующего уровня:', value:`${xpneed} опыта`},
                {name:'КД:', value:`${KD} Очков`},
            )
            message.channel.send({embeds:[userRankEmbed]})
            console.log('Даша ответила на команду: d!profile @mention')
        }
        else{
            const KD = (0.5*u.level/2)
            const xpneed = ((u.level*30)-u.xp)
            const myRankEmbed = new MessageEmbed()
            .setColor('LUMINOUS_VIVID_PINK')
            .setTitle('Ваша статистика:')
            .addFields(
                {name:'Ваш ник:', value:`<@${message.author.id}> ${about_u.badges}`},
                {name:'О себе:', value:`${about_u.about_me}`},
                {name:'Ваш уровень:', value:`${u.level} уровень`},
                {name:'Ваш опыт:', value:`${u.xp} опыта`},
                {name:'До следующего уровня:', value:`${xpneed} опыта`},
                {name:'Ваш КД:', value:`${KD} Очков`},
            )
            message.channel.send({embeds:[myRankEmbed]})
            console.log('Даша ответила на команду: d!profile')
        }
    }

    if (command === '8ball'){
    	//!8ball question <вопрос>
	    let replies = ["Да!", "Нет", "Не знаю", "Может быть...", "Хм... Трудный вопрос", "Наверное", "Не могу сказать"];
	    let result = Math.floor((Math.random() * replies.length));
        let question = args.join(" ");
	    let ballembed = new MessageEmbed()
	    .setColor('LUMINOUS_VIVID_PINK')
        .setTitle('Шар судьбы! :8ball:')
	    .addFields(
        {name: "Вопрос:", value: question},
        {name: "Ответ:", value: replies[result]}
        )
	    message.channel.send({ embeds: [ballembed] })
        console.log('Даша ответила на команду: d!8ball ')	
    }

    if (command === "ping") {
        const timeTaken = Date.now() - message.createdTimestamp
        const pingEmbed = new MessageEmbed()
        .setColor('LUMINOUS_VIVID_PINK')
          .setTitle('Пинг-Понг!')
        .addFields(
          { name: `Пинг бота: ${timeTaken} мс`, value: `Ну, думаю нормальный пинг у меня, хи! <3` },
        )
        message.channel.send({ embeds: [pingEmbed] });
        console.log('Даша ответила на команду: d!ping ')
    }

    if(command === 'write'){
        let about_write = args.join(' ')
        about_u.about_me = '⠀'
        about_u.about_me += about_write
        message.reply(`Ваша информация была изменена: ${about_write}`)
        console.log('Даша ответила на команду: d!write ')
    }

    if(command === 'invite'){
        message.channel.send('https://discord.com/api/oauth2/authorize?client_id=985063730519867405&permissions=8&scope=bot')
        console.log('Даша ответила на команду: d!invite')
    }

    if (command === "hug") {
        const personHugged = message.mentions.users.first();
        if(personHugged){
          let hugEmbed = new Discord.MessageEmbed()
              .setColor('LUMINOUS_VIVID_PINK')
              .setTitle(`${message.author.username} Обнял(а) ${personHugged.username} :heart:`)
              .addFields(
                {name: 'Это так мило <3', value:'можем начнем их шиперить?)'},
              )
              .setTimestamp()
          message.channel.send({ embeds: [hugEmbed] });
        }
        else{
          message.reply(`Выберите мембера!`);
        }
        console.log(`Даша ответила на команду: d!hug`)
    }

    if (command === "punch") {
        const personPunch = message.mentions.users.first();
        if(personPunch){
            let PunchEmbed = new MessageEmbed()
            .setColor('LUMINOUS_VIVID_PINK')
            .setTitle(`${message.author.username} Ударил(а) ${personPunch.username} :punch:`)
            .addFields(
                {name: 'Эй вы!', value:'Не деритесь!!!'},
            )
            .setTimestamp()
            message.channel.send({ embeds: [PunchEmbed] });
        }
        else{
          message.reply(`Выберите мембера!`);
        }
        console.log(`Даша ответила на команду: d!punch`)
    }

    if(command === 'who_is_me'){
        let whoEmbed = new MessageEmbed()
        .setColor('LUMINOUS_VIVID_PINK')
        .setTitle('Привет!')
        .setDescription('[Пригласить бота!](https://discord.com/api/oauth2/authorize?client_id=985063730519867405&permissions=8&scope=bot)')
        .addFields(
            {name:'Меня зовут:', value:'Даша! И я сестра Планки)'},
            {name:'К сожалению...', value:'Планки больше нет... Лучше не говорить об этом'},
            {name:'Но!', value:'Я сделаю ему хорошую замену! У меня гораздо лучше код, чем у моего брата!'},
            {name:'Желаю вам удачи!', value:'Посмотреть мои команды: d!help'},    
        )
        message.channel.send({embeds:[whoEmbed]})
        message.delete()
    }

    if(command === 'badges'){
        const badgesEmbed = new MessageEmbed()
        .setColor('LUMINOUS_VIVID_PINK')
        .setTitle('Бэйджи в профиле!')
        .setDescription('Бэйджи - Знаки рядом с вашим профилем! Они помогают узнать кем вы являетесь)')
        .addFields(
            {name:'Бэйдж 1: 👑 - Dev', value:'Данный Бэйдж имеет только разработчик бота! Получить его можно если вы помогаете с кодом бота'},
            {name:'Бэйдж 2: 🌐  - Testers', value:'Данный Бэйдж имеют только тестеры бота! Помогайте разработчику с проверкой команд, и получите данный бэйдж!'},
            {name:'Бейдж 3: 💍 - Partner', value:'Партнеры Даши! Подавать заявку в d!pauth'},
            {name:'Бэйдж 4: ⚖️  - Hall of Fame', value:'Это люди, которые помогают проекту! Кидают идеи, баги, крутые команды и всячески помогают боту)'},
            {name:'Бэйдж 5: 🧒 - Human', value:'Обычный человек! Как только вы появляетесь в базе данных, то вам автоматом выдается данный бэйдж'},
            {name:'Бэйдж 6: 🤖  - BOT', value:'Не люди... Машины, ничего больше сказать не могу...'},               
        )
        .setTimestamp()
        message.channel.send({embeds:[badgesEmbed]})
        console.log('Даша ответила на команду: d!badges')
    }

    if(command === 'coin'){
        const HeadsOrTails = ["Орел", "Решка", "Орел", "Решка", "Орел", "Решка", "Орел", "Решка", "Орел", "Решка", "Орел", "Решка", "Ого, монета встала на бок..."]
        const game_answer = HeadsOrTails[Math.floor(Math.random() * HeadsOrTails.length)];    
        message.reply(game_answer)
        console.log('Даша ответила на команду: d!coin')
    }

    if(command === 'pauth'){
        const PartnerAuthEmbed = new MessageEmbed()
        .setColor('LUMINOUS_VIVID_PINK')
        .setTitle('Партнерство с Дашей!')
        .setDescription('[Пригласить бота!](https://discord.com/api/oauth2/authorize?client_id=985063730519867405&permissions=8&scope=bot)')
        .addFields(
            {name: `Привет друг!`, value: `Я хочу рассказать тебе про партнерство со мной! Нужно всего лишь несколько критерий:` },
            {name:'1. Сервер 30+', value:'На вашем сервере должно быть 30+ человек не включая ботов!'},
            {name:'2. Добавления меня и Мастеча на ваш сервер', value:'Основным критерием попадания в Партнерство является присутствия меня и моего создателя, что смотреть: Все ли условия выполнены!'},
            {name:'Что дает Партнерство?', value:'Бэйджик в вашем профиле, Бэйджик в профиле сервера в d!server. Также попадание в d!list'},
            {name:'На этом все!', value:'Пиши maste4#0001 для заявки на Партнерство!'},
        )
        .setTimestamp()
        message.channel.send({embeds:[PartnerAuthEmbed]})
        console.log('Даша ответила на команду: d!pauth')
    }

    if(command === 'list'){
        const PartnerListEmbed = new MessageEmbed()
        .setColor('LUMINOUS_VIVID_PINK')
        .setTitle('Список партнеров!')
        .addFields(
            {name:'Фоксфорд. "Глаз Луны"', value:'[Перейти на сервер!](https://discord.gg/D9n23M5A8y)'}
        )
        .setTimestamp()
        message.channel.send({embeds:[PartnerListEmbed]})
    }

    if (command === "slap") {
        const personSlap = message.mentions.users.first();
        if(personSlap){
          let slapEmbed = new Discord.MessageEmbed()
              .setColor('LUMINOUS_VIVID_PINK')
              .setTitle(`${message.author.username} ударил(а) по лицу ${personSlap.username} :clap:`)
              .addFields(
                {name: 'Эй вы!', value:'Не деритесь!!!'},
              )
              .setTimestamp()
          message.channel.send({ embeds: [slapEmbed] });
        }
        else{
          message.reply(`Выберите мембера!`);
        } 
        console.log(`Даша ответила на команду: d!slap`)
    } 
    
    if (command === "premium"){
        const premiumEmbed = new MessageEmbed()
        .setColor('LUMINOUS_VIVID_PINK')
        .setTitle('Dasha Premium')
        .setDescription('Купить Подписку времено не доступно')
        .addFields(
            {name:`Dasha Premium - `,value:`Это подписка, которая помогает проекту жить и оставаться на плаву! Бот работает и без подписки, но если вы хотите разнообразить свой профиль, или использовать крутые команды, то подписка в самый раз)`},
            {name:`1. Крутой значок в профиле!`,value:`Ваш профиль будет украшен крутым бэйджиком саппортера! Люди сразу будут видеть вас)`},
            {name:`2. Премиум команды!`,value:`Вы сможете использовать крутые команды d!rate, d!roullete и другие!`},
            {name:'3. Поставь свою иконку в d!profile!', value:'При помощи команды d!icon вы сможете поставить крутую иконку! P.s картинка должна быть в виде ссылки...'},
            {name:'4. Более мощный хост!', value:'Даша во время работы с вами будет использовать премиум хост, где у вас пинг будет меньше 80(при обычной работе 100+ пинг)'}, 
        )
        .setTimestamp()
        message.channel.send({embeds:[premiumEmbed]})
    }
});

client.login(token)