$(document).ready(function(){
  
    $("input[name=edit]").on("click",function(){

            $("input[type=text],input[type=checkbox],select").removeAttr("disabled");
    })

    $("input[name=save]").on("click",function(){

        $("input[type=text],input[type=checkbox],select").prop("disabled",true);
    })
})