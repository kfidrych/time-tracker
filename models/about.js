window.onload = function(){
    $("#dropdown").on("click", function(){
        // event.stopPropagation()
        $("#dropdown").toggleClass("is-active");
        console.log("werk");
    })
}