on("chat:message", function(msg){
    if (msg.type != 'api') return;
    var cmd = msg.content.toLowerCase().split(' ');
    
    log("Orginal Command: " + cmd);
    log("Message: " + msg);
    if(cmd[0] == "!apiv20spell"){
        log("Dice: " + cmd[1] + " spellDifficulty: " + cmd[4] + " successGoal: " + cmd[5] + " isProcedure: " + cmd[6] + " maxSphereDots: " + cmd[7] + " rollsRemaining: " + cmd[8] + " bonusDice: " + cmd[9] + "diceModifier" + cmd[10]);
        spellRoll(msg.playerid, cmd[1], cmd[2], cmd[3], cmd[4], cmd[5], cmd[6], cmd[7], cmd[8], cmd[9], cmd[10], cmd[11]);
    }
});

function spellRoll(player, dice, spellDifficulty, successGoal, isProcedure, maxSphereDots, rollsRemaining, bonusDice, diceModifier, debug){
    var sendingPlayer = getObj('player', player);
    var playerID = sendingPlayer.get('speakingas').split('|')[1];
    
    var d1 = parseInt(dice) || 0;
    var dm = parseInt(diceModifier) || 0;
    var bc = parseInt(bonusDice) || 0
    var totalDice = d1 + dm + bc;
    
    if(debug == "true"){
        log("Dice: " + dice + " diceModifier: " + diceModifier + " bonusDice: " + bonusDice);
        log("Total Dice Rolled: " + totalDice);
    }
    var spellDC = parseInt(spellDifficulty) || 0;
    if (isProcedure == "true"){
        var v = parseInt(maxSphereDots) || 0;
        totalDice = totalDice + v;
    }
    rollsRemaining = rollsRemaining - 1;
    if(debug == "true"){log("Total Dice Rolled: " + totalDice);}
    
    if(successGoal > 0){
        rollSpell(totalDice, successGoal, spellDC, rollsRemaining, playerID);
    }
}

function rollSpell(dice, successGoal, spellDifficulty, rollsRemaining, player){
    var rolls = new Array();
    var successes = 0;
    var ones = 0;
    var tens = 0;
    var isBotch = false;
    var strrolls = "";

    var playerName = getPlayerName(player);
    if(playerName !== "") {
        var tableCreation = tableSpellTemplate;
        tableCreation = tableCreation.replace("<<PLAYERNAME>>", playerName);
        tableCreation = tableCreation.replace("<<DICENUMBER>>", dice);
        tableCreation = tableCreation.replace("<<DIFFICULTY>>", spellDifficulty);
        for(var i = 0; i < dice; i++){
            var roll = Math.floor((Math.random()*10) + 1);
            rolls[i] = roll;
            checked = false;
            if(roll >= spellDifficulty){
                checked = true;
                successes = successes + 1;
                strrolls = strrolls + successDiceSpellTemplate.replace("<<DIE>>",roll);
            }
            if(roll == 1){
                checked = true;
                ones = ones + 1;
                strrolls = strrolls + botchDiceTemplate;
            }
            if(roll == 10){
                tens = tens + 1;
            }
            if (checked == false)
            {
                strrolls = strrolls +  roll + ' ';
            }
        }
        tableCreation = tableCreation.replace("<<DICEROLL>>", strrolls);
        tableCreation = tableCreation.replace("<<GOODROLLS>>", successes);
        tableCreation = tableCreation.replace("<<ONEROLLS>>", ones);
        ones = ones - tens;
        if (successes == 0 && ones > 0){
            isBotch = true;
        }
        if (ones > 0){
            successes = successes - ones;
        }
        tableCreation = tableCreation.replace("<<TOTALROLL>>", successes);
        
        if( successes > successGoal){
            updateAttributes(player, "successesRemaining", 0);
            var temp = successes - successGoal;
            tableCreation = tableCreation.replace("<<RESULT>>", moreSuccessesTemplate.replace("<<EXTRASUCCESS>>", temp));
            log("More Successes achieved then required: " + temp);
        } else if (successGoal == successes) {
            updateAttributes(player, "successesRemaining", 0);
            tableCreation = tableCreation.replace("<<RESULT>>", successesTemplate);
            log("Spell was cast successfully");
        } else if (successes <= 0 && isBotch == false) {
            spellDifficulty = spellDifficulty + 1;
            if (spellDifficulty >= 9 ){
                spellDifficulty = 9;
                successGoal = successGoal + 1;
                updateAttributes(player, "successesRemaining", successGoal);
            }
            updateAttributes(player, "spellDifficulty", spellDifficulty);
            updateAttributes(player, "rollsRemaining", rollsRemaining);
            tableCreation = tableCreation.replace("<<RESULT>>", failTemplate);
            log("Failed Spell");
        } else if (isBotch) {
            spellDifficulty = spellDifficulty + 1;
            if (spellDifficulty >= 9 ){
                spellDifficulty = 9;
                successGoal = successGoal + 1;
                updateAttributes(player, "successesRemaining", successGoal);
            }
            updateAttributes(player, "spellDifficulty", spellDifficulty);
            updateAttributes(player, "rollsRemaining", rollsRemaining);
            tableCreation = tableCreation.replace("<<RESULT>>", botchTemplate);
            log("BOTCHED Spell spend willpower to roll again");
        } else {
            if (rollsRemaining == 0){
                log("Failed to cast spell max rolls achieved");
                tableCreation = tableCreation.replace("<<RESULT>>", maxRollTemplate);
            }else {
                var temp = successGoal - successes;
                updateAttributes(player, "successesRemaining", temp);
                updateAttributes(player, "rollsRemaining", rollsRemaining);
                tableCreation = tableCreation.replace("<<RESULT>>", successKeepRollingTemplate.replace("<<REMAININGSUCCESSES>>", temp));
                log("Keep Casting remaining successes required: " + temp);
            }
        }
        sendChat("character|"+player, tableCreation);
    }else{
        sendChat("player|"+player, "NEED TO SPECIFY WHO YOU ARE TALKING AS");
    }
}

function updateAttributes(player, type, succ){
    var everything = getAllObjs();
    everything.forEach(function(attr){
        if(attr.get('name') == type && attr.get("_characterid") == player){
            log(attr);
            attr.set('current', succ);
        }
    });
}

function getPlayerName(player){
    var everything = getObj("character", player);
    try{
        var playerName = everything.get("name");
        log(playerName);
        return playerName;
    }catch(exe){
        return "";
    }
}

var tableSpellTemplate = "<table style='max-width: 250px; background-color:white; background-image:url(http://i.imgur.com/pUVH7Pb.png); background-size: 100% 100%; background-repeat: no-repeat;font-family: \"Century Gothic\", CenturyGothic, AppleGothic, sans-serif;'>"
    +"<tr>"
        +"<td align='center' style='padding-top: 20px; padding-right: 20px;padding-left: 20px;'>"
            +"<h3><<PLAYERNAME>> Spell Roll</h3>"
        +"</td>"
    +"<tr>"
    +"<tr>"
        +"<td style='padding-left: 20px; padding-right: 20px'>"
            + "<b>Rolling </b><<DICENUMBER>><b> dice.</b><br><b>Difficulty:</b> <<DIFFICULTY>>"
        +"</td>"
    +"</tr>"
    +"<tr>"
        +"<td style='padding-left: 20px; padding-right: 20px'>"
            +"<b>Roll:</b> <<DICEROLL>>"
            +"<br><b>Sucesses:</b> <<GOODROLLS>> <b>Ones:</b> <<ONEROLLS>>"
            +"<br><b>Total:</b> <<TOTALROLL>>"
        +"</td>"
    +"</tr>"
    +"<tr>"
        +"<td style='padding-left: 20px; padding-right: 20px; padding-bottom: 20px'>"
            +"<<RESULT>>"
        +"</td>"
    +"</tr>"
    +"</table>";
var moreSuccessesTemplate = '<span style="color:green"><b>SPELL CAST WITH EXTRA SUCCESSES <<EXTRASUCCESS>></b></span>';
var successDiceSpellTemplate = "<span style=\"color:green\"><b><<DIE>> </b></span>";
var successesTemplate = '<span style="color:green"><b>SPELL CAST SUCCESSFULLY</b></span>';
var failTemplate = '<span style="color:red"><b>FAILED TO MAKE PROGRESS ON SPELL</b></span>';
var botchTemplate = '<img src="http://i.imgur.com/ytXjID6.png" title="BOTCH" height="200" width="10"/><span style="color:red"><b>BOTCH!!! Spend willpower to save spell</b></span><img src="http://i.imgur.com/ytXjID6.png" title="BOTCH" height="200" width="10"/>';
var maxRollTemplate = '<span style="color:red"><b>SPELL FAILED MAX ROLL ACHIEVED</b></span>';
var successKeepRollingTemplate = '<span style="color:green"><b>KEEP CASTING STILL NEED <<REMAININGSUCCESSES>> SUCCESSES</b></span>';
