function submit() {
    const input = document.getElementById("url-input").value;
    const url = "http://www.tudorlink.com/api/urls";
    const data = {
        url: input
    };

    $.post(url, data)
    .done(function(data){
        $("#result-card").html(
        `<div class="card border-success">
            <div class="card-body text-center text-success">
                <p class="text-center fs-3">${data.short}</p> 
            </div>
        </div>`);
    })
    .fail(function(){
        $("#result-card").html(
        `<div class="card border-danger">
            <div class="card-body text-center text-danger">
                <p class="text-center fs-3">Invalid URL</p> 
            </div>
        </div>`);
    });
}