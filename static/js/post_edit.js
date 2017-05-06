function postCancell(post_id, oldTitle, oldDatetime, oldImg, oldText) {
    alert(1);
    var idPost = '#' + post_id;
    var idTitle = 'postTitle-' + post_id;
    var idDatetime = 'postDatetime-' + post_id;
    var idImg = 'postImg-' + post_id;
    var idText = 'postText-' + post_id;

    var editFunc = "postEdit(" + post_id + ");";
    var deleteUrl = 'delete/' + post_id;

    var editIcon = $('<span class="glyphicon glyphicon-pencil"></span>').attr('onclick', editFunc);
    var editButton = $('<a class="postEdit" title="Edit post" href="" onclick="return false;"></a>').html(editIcon);
    var deleteButton = $('<a class="postDelete" title="Delete post" href=""><span class="glyphicon glyphicon-remove"></span></a>').attr('href', deleteUrl);
    var postButtons = $('<div class="postButtons"></div>').append(editButton, deleteButton);

    var postTitle = $('<h2 class=""></h2>').attr('class', idTitle);
    var postTitle = $(postTitle).text(oldTitle);

    var postDatetime = $('<p class="" id="postDatetime">⌚ {{ entry.datetime }}</p>').attr('class', idDatetime);
    var postDatetime = $(postDatetime).text(oldDatetime);

    var postImg = $('<img src="" id="" class="img-thumbnail img-responsive"/>').attr('id', idImg);
    var postImg = $(postImg).attr('src', oldImg);

    var postText = $("<p id='postText' class=''></p>").attr('class', idText);
    var postText = $(postText).text(oldText);

    $(idPost).html(postButtons);
    $(idPost).append(postTitle, postDatetime, postImg, postText);
    $(idPost).css('font-family', 'glyphicons-halflings-regular');
};

function postEdit(post_id) {
    var idPost = '#' + post_id;
    var idTitle = '.postTitle-' + post_id;
    var idDatetime = '.postDatetime-' + post_id;
    var idImg = '#postImg-' + post_id;
    var idText = '.postText-' + post_id;

    var oldTitle = $(idTitle).text();
    var oldDatetime = $(idDatetime).text();
    var oldImg = $(idImg).attr('src');
    var oldText = $(idText).text();
    var oldTexthtml = $(idText).html();
    alert(oldTexthtml);

    var editUrl = 'edit/' + post_id;
    var deleteUrl = 'delete/' + post_id;

    var cancellFunc = "postCancell(" + post_id + ", " + "'" + oldTitle + "'" + ", " + "'"  + oldDatetime + "'" + ", " + "'" + oldImg + "'" + ", " + "'" + oldText + "'" + ");";

    var cancellIcon = $('<span class="glyphicon glyphicon-arrow-left"></span>').attr('onclick', cancellFunc);
    var cancellButton = $('<a class="postCancell" title="Cancell" href="" onclick="return false;"></a>').html(cancellIcon);
    var deleteButton = $('<a class="postDelete" title="Delete post" href=""><span class="glyphicon glyphicon-remove"></span></a>').attr('href', deleteUrl);
    var cancellButtons = $('<div class="postButtons"></div>').append(cancellButton, deleteButton);

    var formTitle = $('<input required type="text" size=30 class="form-control" name=title id="form-addEntry-Title" value="">').attr('value', oldTitle);
    var formText = $('<textarea required class="form-control" name=text rows=5 cols=40 id="form-addEntry-Text"></textarea>').text(oldText);
    if (oldImg) {
        var showContent = $('<img class="showImg" src="" width="30%" height="30%"/>').attr('src', oldImg);
    }
    var formContent = '<input type="file" id="form-addEntry-File" class = "form-editEntry-Content" accept="image/*" name="editImg">';

    var editTitle = $('<h2 class="form-addEntry-Title"></h2>').text('Edit post:');
    var termTitle = $('<dt></dt>').text('Title:');
    var defTitle = $('<dd></dd>').html(formTitle);
    var termImg = $('<dt></dt>').text('Picture:');
    var defContent = $('<dd></dd>').html(showContent);
    var defImg = $('<dd></dd>').html(formContent);
    var termText = $('<dt></dt>').text('Text:');
    var defText = $('<dd></dd>').html(formText);
    var formButton = $('<button class="btn btn-large btn-primary" type="submit"></button>').text('Edit');

    var defList = $('<dl></dl>').append(termTitle, defTitle, termImg, defContent, defImg, termText, defText, formButton);
    var formTemp = $('<form method="post" enctype="multipart/form-data" action=""></form>').attr('action', editUrl);
    var formEdit = $(formTemp).html(defList);
    var divEdit = $('<div class="form-group"></div>').html(formEdit);

    $(idPost).html(cancellButtons);
    $(idPost).append(editTitle, divEdit);
    $(idPost).css('font-family', 'Arial');
};

function searchReset(notnamelist, empty) {
    $('#icon').attr('class', 'glyphicon glyphicon-search');
    $('#searchButton').css('background-color', 'white');
    $('#searchButton').attr('onclick', 'search();');
    $('#searchPost').removeAttr('disabled');
    $('#searchPost').val('');
    $('.search').css('background-color', 'white');
    $('.searchForm').attr('action', '/');
    if (empty==true)  {
        $('.empty').remove();
    }
    for (i=0; i<notnamelist.length; i++) {
        $(notnamelist[i]).css('display', '');
    }
}

function search() {
    var val = $('#searchPost').val();
    if (val !== '') {
        var nottemp =  '.post' + ':not(:contains(' + val + '))';
        var temp =  '.post' + ':contains(' + val + ')';
        var list = $(temp);
        var notlist = $(nottemp);
        var empty = false;
        if (list.length == 0) {
            var empty = true;
            $('#postRow').append('<div class="empty"><h3>Nothing found on your request :(</h3></div>');
        }
        var notnamelist = new Array();
        for (i=0; i<notlist.length; i++) {

            var id = '#' + $(notlist[i]).attr('id');
            notnamelist.push('"' + id + '"');
            $(id).css('display', 'none');
        }
        var resetFunc = 'searchReset(' + '[' + notnamelist + ']' + ', ' + empty + ');';

        $('#icon').attr('class', 'glyphicon glyphicon-remove');
        $('#searchButton').css('background-color', '#eeeeee');
        $('#searchButton').attr('onclick', resetFunc);
        $('#searchPost').attr('disabled', 'disabled');
        $('.search').css('background-color', '#eeeeee');

        }

};