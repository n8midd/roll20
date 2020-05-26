var tableTemplate = "<table style='max-width: 250px; background-color:white; background-image:url(https://i.imgur.com/7kcg4M2.png); background-size: 100% 100%; background-repeat: no-repeat;font-family: \"Century Gothic\", CenturyGothic, AppleGothic, sans-serif;'>"
                        +"<tr>"
                            +"<td align='center' style='padding-top: 20px;padding-right: 20px;padding-left: 20px;'>"
                                +"<h3><<TITLE>> Roll</h3>"
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
var successDiceTemplate = "<span style=\"color:green\"><b><<DIE>> </b></span>";
var botchDiceTemplate = '<img src="http://i.imgur.com/NwBHyaI.png" title="BOTCH" height="20" width="20"/> ';
var oneSuccessResultTemplate = '<span style="color:green"><b>SUCCESS</b></span>';
var twoSuccessResultTemplate = '<span style="color:green"><b>MODERATE SUCCESS</b></span>';
var threeSuccessResultTemplate = '<span style="color:green"><b>COMPLETE SUCCESS</b></span>';
var fourSuccessResultTemplate = '<span style="color:green"><b>EXCEPTIONAL SUCCESS</b></span>';
var fiveSuccessResultTemplate = '<span style="color:green"><b>PHENOMENAL SUCCESS</b></span>';
var failureResultTemplate = '<span style="color:red"><b>FAILURE</b></span>';
var botchResultTemplate = '<span style="color:red"><b>BOTCH!!!</b></span>'
 
function WODdice(char, player, title, pool1, mod, diff, whoSent) {
    var suc = 0;
    var one = 0;
    var rolls = new Array();
    var rr = false;
 
    var num = Number(pool1) + Number(mod);
    
    
    if (num > 0)
    {
        if ( diff == null ) {            diff = 6               }
        if ( diff > 10 ) {            diff = 10               }
        if ( diff < 2 ) {            diff = 2               }
        if ( num > 20 ) {            num = 20              }
        
             //sendChat("Roll", s1);
             var text = "";
        var startText = "/w gm ";
        var tableCreation = tableTemplate;
        
        tableCreation = tableCreation.replace("<<TITLE>>", title);
        
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
            if (roll == 10)
            {
                suc = suc+1;
            }
        }
 
         tableCreation = tableCreation.replace("<<DICEROLL>>", strrolls);
         rolls = new Array();
       
         tableCreation = tableCreation.replace("<<GOODROLLS>>", suc);
         tableCreation = tableCreation.replace("<<ONEROLLS>>", one);
         tableCreation = tableCreation.replace("<<TOTALROLL>>", suc);
 
        // Display results
 
            if ( (suc >0) )
            {
              tableCreation = tableCreation.replace("<<RESULT>>", oneSuccessResultTemplate);              
            }
            else if ( one > 0 && suc==0 )
            {
                    tableCreation = tableCreation.replace("<<RESULT>>", botchResultTemplate);            
                    }
            else
            {
                    tableCreation = tableCreation.replace("<<RESULT>>", failureResultTemplate);                
                    }
           
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
        var cmd2 = msg.content.split(';');
            WODdice( msg.playerid, 1, cmd2[1], cmd2[2], cmd2[3], cmd2[4], inputName );
 
    }
 
});