$(function () {
    $("form").submit(function () {
        window.location.href = `/${$("input").val()}`;
        return false;
    })
}
)