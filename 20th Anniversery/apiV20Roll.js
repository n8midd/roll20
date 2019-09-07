var tableTemplate = "<table style='max-width: 250px; background-color:white; background-image:url(http://i.imgur.com/pUVH7Pb.png); background-size: 100% 100%; background-repeat: no-repeat;font-family: \"Century Gothic\", CenturyGothic, AppleGothic, sans-serif;'>"
                        +"<tr>"
                            +"<td align='center' style='padding-top: 20px;padding-right: 20px;padding-left: 20px;'>"
                                +"<h3><<TITLE>>Roll</h3>"
                            +"</td>"
                        +"</tr>"
                        +"<tr>"
                            +"<td style='padding-left: 20px; padding-right: 20px'>"
                                + "<b>Rolling </b><<DICENUMBER>><b> dice.</b><br><b>Difficulty:</b> <<DIFFICULTY>>"
                            +"</td>"
                        +"</tr>"
                        +"<<HASSPECIALITY>>"
                        +"<<HASWILLPOWER>>"
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
var hasSpecialTemplate = "<tr><td style='padding-left: 20px; padding-right: 20px'><b>Speciality:</b> 10 counts as two successes.</td></tr>";
var successDiceTemplate = "<span style=\"color:green\"><b><<DIE>> </b></span>";
var botchDiceTemplate = '<img src="http://i.imgur.com/NwBHyaI.png" title="BOTCH" height="20" width="20"/> ';
var oneSuccessResultTemplate = '<span style="color:green"><b>MARGINAL SUCCESS</b></span>';
var twoSuccessResultTemplate = '<span style="color:green"><b>MODERATE SUCCESS</b></span>';
var threeSuccessResultTemplate = '<span style="color:green"><b>COMPLETE SUCCESS</b></span>';
var fourSuccessResultTemplate = '<span style="color:green"><b>EXCEPTIONAL SUCCESS</b></span>';
var fiveSuccessResultTemplate = '<span style="color:green"><b>PHENOMENAL SUCCESS</b></span>';
var failureResultTemplate = '<span style="color:red"><b>FAILURE</b></span>';
var botchResultTemplate = '<img src="http://i.imgur.com/ytXjID6.png" title="BOTCH" height="200" width="10"/><span style="color:red"><b>BOTCH!!!</b></span><img src="http://i.imgur.com/ytXjID6.png" title="BOTCH" height="200" width="10"/>'
 
function WODdice(char, player, pool1, mod, diff, spec, willpower, hidden, whoSent) {
    var suc = 0;
    var one = 0;
    var wp = willpower;
    var rolls = new Array();
    var rr = false;
 
    var num = Number(pool1) + Number(mod);
    if (spec == 1)
    {
        num = num + 1;
    }
    
    if (num > 0)
    {
        if ( diff == null ) {            diff = 6               }
        if ( diff > 10 ) {            diff = 10               }
        if ( diff < 2 ) {            diff = 2               }
        if ( num > 20 ) {            num = 20              }
        if ( spec != 1 && spec != 0 ) {            spec = 0               }
        if ( wp != 1 && wp != 0 ) {            wp = 0             }
 
             //sendChat("Roll", s1);
             var text = "";
        var startText = "/w gm ";
        var tableCreation = tableTemplate;
        
        tableCreation = tableCreation.replace("<<TITLE>>", "");
        
        tableCreation = tableCreation.replace("<<DICENUMBER>>", num);
        tableCreation = tableCreation.replace("<<DIFFICULTY>>", diff);
        if ( spec == 1)
        {
            tableCreation = tableCreation.replace("<<HASSPECIALITY>>", hasSpecialTemplate);
        }
        else
        {
            tableCreation = tableCreation.replace("<<HASSPECIALITY>>", "");
        }
        if (wp == 1)
        {
            suc=suc+1;
            tableCreation = tableCreation.replace("<<HASWILLPOWER>>", "<tr><td style='padding-left: 20px; padding-right: 20px; padding-bottom: 10px'><b>Willpower Used:</b> At least 1 success guaranteed.</td></tr>");
           
        }
        else
        {
            tableCreation = tableCreation.replace("<<HASWILLPOWER>>", "");
        }
        ten = 0;
        var strrolls = "";
        var checked = false;
        for ( var i=0; i<num; i++) {
            var roll = Math.floor((Math.random()*10)+1);
            rolls[i] = roll;
            checked = false;
            if ( roll>=diff )
            {
                checked = true;
                suc = suc+1;
                strrolls = strrolls + successDiceTemplate.replace("<<DIE>>",roll);
            }
            if ( roll==1 && rr == false )
            {
                checked = true;
                one = one+1;
                strrolls = strrolls + botchDiceTemplate;
            }
            if (checked == false)
            {
                strrolls = strrolls +  roll + ' ';
            }
        }
 
            tableCreation = tableCreation.replace("<<DICEROLL>>", strrolls);
        rolls = new Array();
       
       
            var temp = suc-one;
         tableCreation = tableCreation.replace("<<GOODROLLS>>", suc);
         tableCreation = tableCreation.replace("<<ONEROLLS>>", one);
         tableCreation = tableCreation.replace("<<TOTALROLL>>", temp);
 
        // Display results
 
            if ( (suc>one && suc >0) || wp == 1 )
            {
                if (temp == 1 || (wp == 1 && temp < 1))
                {                    
                    tableCreation = tableCreation.replace("<<RESULT>>", oneSuccessResultTemplate);              
                }
                if (temp == 2)
                {
                    tableCreation = tableCreation.replace("<<RESULT>>", twoSuccessResultTemplate);              
            }
                if (temp == 3)
                {
                    tableCreation = tableCreation.replace("<<RESULT>>", threeSuccessResultTemplate);            
            }
                if (temp == 4)
                {
                    tableCreation = tableCreation.replace("<<RESULT>>", fourSuccessResultTemplate);              
            }
                if (temp > 4)
                {
                    tableCreation = tableCreation.replace("<<RESULT>>", fiveSuccessResultTemplate);              
                }
            }
            else if ( suc<one && suc==0 && wp == 0)
            {
                    tableCreation = tableCreation.replace("<<RESULT>>", botchResultTemplate);            
                    }
            else
            {
                    tableCreation = tableCreation.replace("<<RESULT>>", failureResultTemplate);                
                    }
               
                      if (hidden==2)
        {
            var tempText = "/w " + whoSent + " "+tableCreation;
            if (player==1) sendChat("player|"+char, tempText);
            else sendChat("character|"+char, tempText);
        }
        if (hidden >= 1) tableCreation = "/w gm " + tableCreation;
        if (player==1) sendChat("player|"+char, tableCreation);
        else sendChat("character|"+char, tableCreation);
    }
};
 
on("chat:message", function(msg) {
    if ( msg.type != 'api' ) return;
    var cmd = msg.content.toLowerCase().split(' ');
 
    if ( cmd[0] == "!apiv20roll" ) {
 
        var inputName = msg.who;
        var list = findObjs( {
            _type: "character",
            name: inputName
        });
        var cmd2 = msg.content.split(' ');
        var str = "";
        for (i = 8; i < cmd2.length; i++)
        {
            str = str + " " + cmd2[i];
        }
        str = str.substring(1);
        if (list.length == 0)
        {
            WODdice( msg.playerid, 1, cmd[1], cmd[2], cmd[3], cmd[4], cmd[5], str, inputName );
 
        }
        else
        {
            WODdice( list[0].id, 0, cmd[1], cmd[2], cmd[3], cmd[4], cmd[5], str, inputName  );
 
        }
    }
 
});