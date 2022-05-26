/*global describe*/
/*global require*/
/*global it*/
/*global console*/
/*global process*/
/*global exports*/
/*global Promise*/


// LP SOLVE CLI REFERENCE:
// http://lpsolve.sourceforge.net/5.5/lp_solve.htm
//
//

// var reformat = require("./Reformat.js");

exports.reformat = require("./Reformat.js");

function clean_data(data){

    //
    // Clean Up
    // And Reformatting...
    //
    data = data.replace("\\r\\n","\r\n");


    data = data.split("\r\n");
    data = data.filter(function(x){
        
        var rx;
        
        //
        // Test 1
        rx = new RegExp(" 0$","gi");
        if(rx.test(x) === true){
            return false;
        }

        //
        // Test 2
        rx = new RegExp("\\d$","gi");
        if(rx.test(x) === false){
            return false;
        }
        

        return true;
    })
    .map(function(x){
        return x.split(/\:{0,1} +(?=\d)/);
    })
    .reduce(function(o,k,i){
        o[k[0]] = k[1];
        return o;
    },{});
    
    return data;
}





exports.solve = function(model){
    //
    return new Promise(function(res, rej){
        //
        // Exit if we're in the browser...
        //
        if(typeof window !== "undefined"){
            rej("Function Not Available in Browser");
        }
        //
        // Convert JSON model to lp_solve format
        //
        var data = require("./Reformat.js")(model);
        
        
        if(!model.external){
            rej("Data for this function must be contained in the 'external' attribute. Not seeing anything there.");
        }
        
        // 
        // In the args, they *SHALL* have provided an executable
        // path to the solver they're piping the data into
        //
        if(!model.external.binPath){
            rej("No Executable | Binary path provided in arguments as 'binPath'");
        }
        
        //
        // They also need to provide an arg_array
        //
        if(!model.external.args){
            rej("No arguments array for cli | bash provided on 'args' attribute");
        }
        
        //
        // They also need a tempName so we know where to store
        // the temp file we're creating...
        //
        if(!model.external.tempName){
            rej("No 'tempName' given. This is necessary to produce a staging file for the solver to operate on");
        }
    });
};





/*
model.external = {
    "binPath": "C:/lpsolve/lp_solve.exe",
    "tempName": "C:/temp/out.txt",
    "args": [
        "-S2"
    ]
    
}

*/