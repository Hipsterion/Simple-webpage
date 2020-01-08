let promise = $.get("https://api.themoviedb.org/3/movie/popular?api_key=8918eeb157819cd67ed7afef14cea55c&language=en-US&page=1");

promise.then(
    data => {
        $.each(data['results'], function(index, movie){
            $('#topMoviesTable > tbody:last-child').append(`<tr><td>${movie["popularity"]}</td><td>${movie['vote_count']}</td><td>${movie['id']}</td><td>${movie['title']}</td><td>${movie['vote_average']}</td><td>${movie['overview']}</td><td>${movie['release_date']}</td></tr>`);
    })
    },
    error => console.log('error:', error)
);

