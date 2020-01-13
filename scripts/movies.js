

$(document).ready(function(){
    let promise = $.get("https://api.themoviedb.org/3/movie/popular?api_key=8918eeb157819cd67ed7afef14cea55c&language=en-US&page=1");
    promise.then(
    data => {
        $.each(data['results'], function(index, movie){
            $('#topMoviesTable > tbody:last-child').append(`<tr data-toggle="tooltip" data-placement="bottom" title data-html="true"><td>${movie["popularity"]}</td><td>${movie['vote_count']}</td><td>${movie['id']}</td><td>${movie['title']}</td><td>${movie['vote_average']}</td><td>${movie['overview']}</td><td>${movie['release_date']}</td></tr>`);
            fixPoster();
            
        })
    },
    error => console.log('error:', error)
);
})

function fixPoster(row){
    $("tbody tr").last().hover(function(eventObj){
        var id = $(eventObj.target.parentNode).find("td")[2].innerHTML;
        var request = $.get(`https://api.themoviedb.org/3/movie/${id}?api_key=8918eeb157819cd67ed7afef14cea55c&language=en-US`)
        request.then(
            movie => {$(eventObj.target.parentNode).attr("data-original-title", `<img src="https://image.tmdb.org/t/p/w600_and_h900_bestv2/${movie['poster_path']}" alt="Poster imag">`), $(eventObj.target.parentNode).tooltip();},
            error1 => console.log("error", error1)
        );
    })
}




function toggleShareRatingForm() {
    $('#ratingForm').fadeIn('show');
}

function handleCancelForm() {
    $('#ratingForm').fadeOut('normal');
    $('#ratingForm')[0].reset();
}

function handleSubmitForm() {
    var movieId = $('#idField').val();
    var ratingValue = $('#ratingField').val();
    $.post(`https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=8918eeb157819cd67ed7afef14cea55c&session_id=90d3291a67e856264a35ae84d2da89f3ba618c75`, {"value": ratingValue}, function(data, status){alert("Data: " + data + "\nStatus: " + status)});

    $('#ratingForm')[0].reset();
    $('#ratingForm').fadeOut('normal');
}
