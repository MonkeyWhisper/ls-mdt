var  MDT_DATA = { };
var PAGE = "page-dashboard";
var LoggedUser = "David Lincoln";
var AddingImage = false;
var selectedIdentifier = "";
var IsInContextMenu = false;
var objectRemove = null;
var rightClickUnit = null;
var editingBulletin = null;
var rightClickDispatch = null;

var isBigImage = false;

$(`.nav-item`).click(function(e, ui) {
    OpenPage($(this)[0].classList[1].replace("nav","page"));
    AudioPlay("sounds/click.wav", 0.5)
})

function OpenPage(PAGE2) {
    if ($(`.nav-selected`).length) {
        $('.'+$(`.nav-selected`)[0].classList[1].replace("nav","page")).hide(); 
        $(`.nav-selected`).removeClass("nav-selected");
    }

    $('.'+PAGE2).show(); 
    $(`.`+PAGE2.replace("page","nav")).addClass("nav-selected");

    $(`.edit-button`).each(function(key, value) {
        $(value).show();
        $(value).css("cursor", "default").addClass("disabled-edit");
    })
    if (PAGE2 == "page-dashboard" || PAGE2 == "page-map") {
        $(`.edit-buttons`).hide();
    } else if(PAGE2 == "page-profile" || PAGE2 == "page-car") {
        $(`.edit-buttons`).show();
        $(`.button-add`).hide();
    } else if(PAGE2 == "page-incident" || PAGE2 == "page-reports" || PAGE2 == "page-bolo") {
        $(`.edit-buttons`).show();
        $(`.button-add`).show().removeClass("disabled-edit").css("cursor", "pointer");
    } else if(PAGE2 == "page-department") {
        $(`.edit-buttons`).show();
        $(`.button-add`).show().removeClass("disabled-edit").css("cursor", "pointer");
        $(`.button-refresh`).hide();
        $(`.button-edit`).hide();
        $(`.button-save`).hide();

        if (MDT_DATA.departments[MDT_DATA.currentuser.job.name].sherrifgrade != MDT_DATA.currentuser.job.grade.level)
            $(`.button-add`).show().addClass("disabled-edit").css("cursor", "pointer");
    }
    $(`.button-refresh`).removeClass("disabled-edit").css("cursor", "normal");
    ResetMDTValues();

    PAGE = PAGE2;
}

$(`.edit-button`).click(function(){
    if ( !$(this).hasClass("disabled-edit") ) {
        var typeOfDo = $(this)[0].classList[1]

        if (typeOfDo == "button-add") {
            $(`.edit-button`).each(function(key, value) {
                if ( $(value)[0].classList[1] != "button-edit" ) {
                    $(value).css("cursor", "pointer").removeClass("disabled-edit");
                }
            });

            $(this).css("cursor", "default").addClass("disabled-edit");
            CreatePage(PAGE);
        } else if (typeOfDo == "button-save") {
            SavePage(PAGE)
        } else if(typeOfDo == "button-refresh") {
            $(`.button-edit`).addClass("disabled-edit");
            $(`.button-save`).addClass("disabled-edit");
            $(`.button-add`).removeClass("disabled-edit");

            ResetMDTValues();
        } else if (typeOfDo == "button-edit") {
            $(`.button-edit`).addClass("disabled-edit");
        }
        AudioPlay("sounds/click.wav", 0.5)
    }
});

function StatusBox() {
    selectedIdentifier = null;

    $(`.status-box`).unbind( "click" ).click(function(){
        var text = $(this).text()
        var thisClass = $(this)[0].classList
    
        $(`.${thisClass[1]}`).each(function(key,value){
            $(value).removeClass("resolved-rep").removeClass("unresolved-rep")
        });

        if ("Resolved" == text) {
            $(this).addClass("resolved-rep")
        } else {
            $(this).addClass("unresolved-rep")
        }

    });
}

function SetupContextMenu() {
    isBigImage = false;

    $(`.veh-item`).unbind( "contextmenu" ).contextmenu(function(e){
        if (!$(`.button-edit`).hasClass("disabled-edit"))
            return; 
        if (IsInContextMenu) 
            return;

            $(`<div class="flip-in-hor-bottom" id="context-menu" >
        
            <div class="item">
                <i class="fas fa-trash"></i> <b>Remove
            </div>

            </div>`)
            .appendTo("body")
            .offset({left:e.pageX, top:e.pageY});
            IsInContextMenu = true

            objectRemove = $(this)
    });

    $(`.image-gallery`).unbind( "contextmenu" ).contextmenu(function(e){
        if (!$(`.button-edit`).hasClass("disabled-edit"))
            return; 
        if (IsInContextMenu) 
            return;

            $(`<div class="flip-in-hor-bottom" id="context-menu" >
        
            <div class="item">
                <i class="fas fa-trash"></i> <b>Remove
            </div>

            </div>`)
            .appendTo("body")
            .offset({left:e.pageX, top:e.pageY});
            IsInContextMenu = true

            objectRemove = $(this)
    });

    $(`.image-little-gallery`).unbind( "contextmenu" ).contextmenu(function(e){

        if (!$(`.button-edit`).hasClass("disabled-edit"))
            return; 
        if (IsInContextMenu) 
            return;

            $(`<div class="flip-in-hor-bottom" id="context-menu" >
        
            <div class="item">
                <i class="fas fa-trash"></i> <b>Remove
            </div>

            </div>`)
            .appendTo("body")
            .offset({left:e.pageX, top:e.pageY});
            IsInContextMenu = true

            objectRemove = $(this)
    });

    $(`.license-item`).unbind( "click" ).click(function(e){

        if (!$(`.button-edit`).hasClass("disabled-edit"))
            return; 
        
        if ($(this).hasClass("n-lic"))
            $(this).addClass("y-lic").removeClass("n-lic");
        else
            $(this).removeClass("y-lic").addClass("n-lic");
    });

    $(`.image-big > img`).unbind( "click" ).click(function(e){

        if (!$(`.button-edit`).hasClass("disabled-edit"))
            return; 

        isBigImage = true;
        
        $(`.gallery-link`).fadeIn(250);

        $(`.gallery-add-buttons`).hide();
        $(`.add-image-inp`).show();
    });
}

function isFloat(n) {
    return parseFloat(n.match(/^-?\d*(\.\d+)?$/))>0;
}

$(document).on("mousedown", ".item", function (e) {
    switch (e.which) {
        case 1:
            
            e.preventDefault();
            var currentSituation
            if ($(this).html().includes("Remove"))
                currentSituation = "remove"
            else if ($(this).html().includes("Set Waypoint"))
                currentSituation = "waypoint"
            else if ($(this).html().includes("Set Radio"))
                currentSituation = "radio"
            else if ($(this).html().includes("Set Callsign"))
                currentSituation = "callsign"
            else if ($(this).html().includes("Toggle Duty"))
                currentSituation = "duty"
            
            else if ($(this).html().includes("Attached Units"))
                currentSituation = "attached"
            else if ($(this).html().includes("Detach"))
                currentSituation = "detach"
            else if ($(this).html().includes("Set Respond Waypoint"))
                currentSituation = "waypoint_rs"
            else if ($(this).html().includes("Respond"))
                currentSituation = "respond"

            else if ($(this).html().includes("Change Grade"))
                currentSituation = "grade_chan"
            else if ($(this).html().includes("Fire From Department"))
                currentSituation = "fire_user"
            else if ($(this).html().includes("Give Job"))
                currentSituation = "give_job"

            else if ($(this).html().includes("Add To Crime"))
                currentSituation = "add_to_crime"


            if (currentSituation == "remove") {
                $(objectRemove).remove();
                SetFineAndSentence();
                
                IsInContextMenu = false
                $("#context-menu").remove();
            } else if (currentSituation == "add_to_crime") {
                if (MDT_DATA.users[rightClickUnit] != undefined)
                    $(`.crime-incident`).append(`<div class="veh-item" id="item-${rightClickUnit}">${MDT_DATA.users[rightClickUnit].charinfo.firstname} ${MDT_DATA.users[rightClickUnit].charinfo.lastname}</div>`);

                IsInContextMenu = false
                $("#context-menu").remove();
            }else if (currentSituation == "waypoint") {
                unit = $(`#unit-${rightClickUnit}`).data("unitData")

                $.post("https://ls-mdt/setWaypoint", JSON.stringify({
                    UNIT_DATA: unit,
                }));

                IsInContextMenu = false
                $("#context-menu").remove();
            } else if (currentSituation == "radio") {
                $(`.unit-info `).children().each(function(key, value) {
                    $(value).hide();
                });

                $(`.unit-box-radio`).show();
                $(`.unit-info `).fadeIn(250);

                IsInContextMenu = false
                $("#context-menu").remove();
            } else if (currentSituation == "callsign") {
                $(`.unit-info `).children().each(function(key, value) {
                    $(value).hide();
                });

                $(`.unit-box-callsign`).show();
                $(`.unit-info `).fadeIn(250);

                IsInContextMenu = false
                $("#context-menu").remove();
            } else if (currentSituation == "duty") {
                var NEW_DATA_UNIT = $(`#unit-${rightClickUnit}`).data("unitData");
                NEW_DATA_UNIT.onduty = !NEW_DATA_UNIT.onduty;

                $.post("https://ls-mdt/setUnitData", JSON.stringify({
                    UNIT_DATA: NEW_DATA_UNIT,
                    TYPE: "duty",
                }));

                IsInContextMenu = false
                $("#context-menu").remove();
            } else if (currentSituation == "waypoint_rs") {
                $.post("https://ls-mdt/setWaypointResponse", JSON.stringify({
                    RESPONSE_DATA: rightClickDispatch,
                }));

                IsInContextMenu = false
                $("#context-menu").remove();
            } else if (currentSituation == "respond") {
                var NEW_DATA_UNIT = RespondUpdate("add")
                $.post("https://ls-mdt/respondDispatch", JSON.stringify({
                    RESPONSE_DATA: rightClickDispatch,
                    UNIT_DATA: NEW_DATA_UNIT, 
                }));

                $.post("https://ls-mdt/setUnitData", JSON.stringify({
                    UNIT_DATA: NEW_DATA_UNIT,
                    TYPE: "radio",
                }));

                IsInContextMenu = false
                $("#context-menu").remove();
            } else if (currentSituation == "detach") {
                $.post("https://ls-mdt/detachDispatch", JSON.stringify({
                    RESPONSE_DATA: rightClickDispatch,
                }));

                var NEW_DATA_UNIT = RespondUpdate("remove")
                $.post("https://ls-mdt/setUnitData", JSON.stringify({
                    UNIT_DATA: NEW_DATA_UNIT,
                    TYPE: "radio",
                }));

                IsInContextMenu = false
                $("#context-menu").remove();
            } else if (currentSituation == "attached") {
                if (Object.keys(rightClickDispatch.units).length > 0 ) {
                    $(`.attached-units`).fadeIn(250);
                    $(`.attached-unit-list`).empty();
    
                    $.each(rightClickDispatch.units, function(key, value) {
                        $(`.attached-unit-list`).prepend(`<div class="unit-item">
                        <div class="unit-name">${value.fullname}</div>
        
                        <div class="unit-radio">${MDT_DATA.employees[value.identifier].radio}</div>
        
                        <div class="unit-callsign">${MDT_DATA.employees[value.identifier].callsign}</div>
        
                        <div class="unit-department department-${MDT_DATA.employees[value.identifier].department}">${MDT_DATA.employees[value.identifier].department}</div>
                    </div>`)
                    })
                }
                
                IsInContextMenu = false
                $("#context-menu").remove();
            } else if(currentSituation == "grade_chan") {
                $(`.grade-info`).fadeIn(250);

                var joblist = MDT_DATA.jobs[MDT_DATA.currentuser.job.name]

                $(`.grade-list`).empty();
                $.each(joblist.grades, function(key, value) {
                    $(`.grade-list`).append(`<option value="${key}">${value.name}</option>`)
                })

                IsInContextMenu = false
                $("#context-menu").remove();
            } else if(currentSituation == "fire_user") {
                var unit = $(`#unit-${rightClickUnit}`).data("unitData")
                $.post("https://ls-mdt/setDepartment", JSON.stringify({
                        UNIT_DATA: unit,
                        TYPE: "fire",
                }));

                IsInContextMenu = false
                $("#context-menu").remove();
            } else if(currentSituation == "give_job") {
                var unit = $(`#department-p-${rightClickUnit}`).data("departmentData")

                $.post("https://ls-mdt/setDepartment", JSON.stringify({
                        UNIT_DATA: unit,
                        TYPE: "add",
                        CURRENT_DATA: MDT_DATA.currentuser
                }));

                IsInContextMenu = false
                $("#context-menu").remove();
            } else {
                IsInContextMenu = false
                $("#context-menu").remove();
            }
            AudioPlay("sounds/click.wav", 0.5)
            break;
    }
});

function RespondUpdate(type) {
    var respond = null;
    $.each(MDT_DATA.employees, function(key, value) {
        if (value.identifier == MDT_DATA.currentuser.identifier) {
            if (type == "add") {
                value.history.responded_week++;
            } else if (type == "remove") {
                value.history.responded_week--;
            }
            respond = value;
        }
    })

    return respond;
}

$( "body" ).mousedown(function(e, ui){
    if ($(e.target).parent().parent().attr('id') != "context-menu" && IsInContextMenu) {
        IsInContextMenu = false;
        AudioPlay("sounds/fail.wav", 0.5);
        $("#context-menu").remove();
    }

    if ( $(`.attached-units`).css("display") != "none" ) {
        $(`.attached-units`).fadeOut(250);
    }
})

function CrimeClickable() {
    $(".offense-item").on("mousedown", function (e) {
        var newItem = $(this).find(".off-off").html();
        if (e.which == 1) {
            var found = false
            $(".cur-holder").children().each(function(key, value) {
                if (newItem == $(value).html()) {
                    found = true;
                }
            })
            if (!found) {
                $(".cur-holder").prepend(`<div class="charges-tag">${$(this).find(".off-off").html()}</div>`);
                AudioPlay("sounds/click.wav", 0.5)
            }
        } else if(e.which == 3) {
            $(".cur-holder").children().each(function(key, value) {
                if (newItem == $(value).html()) {
                    $(value).remove();
                    AudioPlay("sounds/click.wav", 0.5)
                }
            })
        }
    });
}

function SetFineAndSentence() {
    var fine = 0;
    var sentence = 0;
    $(".crimes-inciden-list").children().each(function(key, value) {
        var getItem = FindCode($(value).html())
        fine += getItem.fine
        sentence += getItem.months
    });
    $(`.fine-amount`).html(`${fine}$`)
    $(`.sentence-days`).html(`${sentence}`)
}

function FindCode(find_by_title) {
    var text = "";
    $.each(MDT_DATA.penal, function (_, value) {
        $.each(value.values, function (_, v) {
            text = v;
        });
    });
    return text
}


function AddImageToPage(page, imagelink) {
    $("#imagecheck").load(imagelink, function(response, status, xhr) {
        $("#imagecheck").html("")
        if (status != "error") {
            var randomID = makeid(25);
            if (page == "page-incident") {
                $(`.gallery-incident`).append(`<div class="image-little-gallery" id="item-${randomID}"><img src="${imagelink}"></div>`)
            } else if (page == "page-reports") {
                $(`.gallery-report`).append(`<div class="image-little-gallery" id="item-${randomID}"><img src="${imagelink}"></div>`)
            } else if (page == "page-bolo") {
                $(`.gallery-bolo`).append(`<div class="image-little-gallery" id="item-${randomID}"><img src="${imagelink}"></div>`)
            } else if (page == "page-profile") {
                if (!isBigImage)
                    $(`.image-gallery-user`).append(`<div class="image-gallery" id="item-${randomID}"><img src="${imagelink}"></div>`)
                else
                    FindImage(imagelink, $(`.image-person > img`));
            } else if (page == "page-car") {
                if (!isBigImage)
                    $(`.gallery-vehicle`).append(`<div class="image-gallery" id="item-${randomID}"><img src="${imagelink}"></div>`)
                else
                    FindImage(imagelink, $(`.image-vehicle > img`));
            } 
            SetupContextMenu();
        }
    });
}

$(`.add-icon`).click(function(){
    var typeICON = $(this)[0].classList[1]
    var randomID = makeid(25)
    if (typeICON != "new-bulletin") {
        if ($(`.button-edit`).hasClass("disabled-edit") && $(`.button-save`).hasClass("disabled-edit"))
            return AudioPlay("sounds/fail.wav", 0.5);

        if (!$(`.button-edit`).hasClass("disabled-edit"))
            return AudioPlay("sounds/fail.wav", 0.5); 

        if (typeICON == "new-weapon-incident") {
            $(`.weapons-incident-list`).append(`<div class="veh-item" id="item-${randomID}" contenteditable="true">Input Weapon...</div>`);
        } else if (typeICON == "new-hostage-incident") {
            $(`.incident-hostage`).append(`<div class="veh-item" id="item-${randomID}"  contenteditable="true">Input Hostage...</div>`);
        } else if (typeICON == "new-officer-incident") {
            $(`.officer-incident`).append(`<div class="veh-item" id="item-${randomID}"  contenteditable="true">Input Officer...</div>`);
        } else if (typeICON == "new-criminal-incident") {
            $(`.persons-department`).fadeIn(250);
            $(`.person-to-add-department-list`).empty();
        
            $.each(MDT_DATA.users, function(key, value) { 
                if (value.identifier != MDT_DATA.currentuser.identifier) {
                    $(`.person-to-add-department-list`).prepend(`<div class="deparment-person" id="department-p-${value.identifier}">
                    <div class="profile-person-image"><img src="debug_image/Katman 7.png" class="image-little"></div>
                    <div class="profile-person-name">${value.charinfo.firstname} ${value.charinfo.lastname}</div>
            
                    <div class="profile-person-citizen">Citizen ID<br><b>${value.identifier}</b></div>
            
                    <div class="profile-person-job">Proffesion<br><b>${value.job.label} | ${value.job.grade}</b></div>

                    <div class="profile-person-record">Records<br><b>Person have <span>${Object.keys(GetUserIncidentList(value.charinfo.firstname + " " + value.charinfo.lastname)).length}</span> record</b></div>
            
                    ${IsWanted(value.tags) == true ? `<div class="profile-person-wanted">WANTED</div>` : ``}
                </div>`)
                $(`#department-p-${value.identifier}`).data("departmentData", value);
                ContextMenuDepartment(value.identifier)
                FindImage(value.profileimage, $($(`#department-p-${value.identifier}`).find(".profile-person-image > img")));
                }
            });

            //$(`.crime-incident`).append(`<div class="veh-item" id="item-${randomID}"  contenteditable="true">Input Criminal...</div>`);
        } else if (typeICON == "new-crime-incident") {
            $(".inc-char-table").slideDown(500);
            $(".inc-char-table").fadeIn(500);
            $(".cur-holder").empty();

            var Penalties = MDT_DATA.penal;

            $(".main-offense").empty();
            $.each(Penalties, function (key, value) {
                $(".main-offense").append(`<div class="offfense-title">${value.title}</div><div class="offenses-container grid-off title-${key}"></div>`);
                $.each(value.values, function (_, v) {
                    $(`.title-${key}`).append(`<div class="offense-item" style="background-color: var(--color-charge-${v.color})">
                        <div style="width: 100%;">
                            <div class="off-off">${v.title}</div>
                        </div>
                        <div style="width: 100%;">
                            <div class="off-month">${v.months} Months - $${v.fine}
                        </div>
                    </div>`);
                });
            });

            CrimeClickable();
        } else if (typeICON == "new-witness-incident") {
            $(`.witness-list`).append(`<div class="veh-item" id="item-${randomID}"  contenteditable="true">Input Witness...</div>`);
        } else if (typeICON == "new-officer-report") {
            $(`.officer-report`).append(`<div class="veh-item" id="item-${randomID}"  contenteditable="true">Input Officer...</div>`);
        } else if (typeICON == "new-emergency-report") {
            $(`.emergency-report`).append(`<div class="veh-item" id="item-${randomID}"  contenteditable="true">Input Emergency...</div>`);
        } else if (typeICON == "new-tag-report") {
            $(`.tags-report`).append(`<div class="veh-item" id="item-${randomID}"  contenteditable="true">Input Tags...</div>`);
        } else if (typeICON == "new-tag-bolo") {
            $(`.tags-bolo`).append(`<div class="veh-item" id="item-${randomID}"  contenteditable="true">Input Tags...</div>`);
        } else if (typeICON == "new-officer-bolo") {
            $(`.officer-bolo`).append(`<div class="veh-item" id="item-${randomID}"  contenteditable="true">Input Officer...</div>`);
        } else if (typeICON == "new-bolo-photo") {
            $(`.gallery-link`).fadeIn(250);
        } else if (typeICON == "new-user-tag") {
            $(`.tags-list-user`).append(`<div class="veh-item" id="item-${randomID}"  contenteditable="true">Input Tags...</div>`);
        } else if (typeICON == "new-incident-photo") {
            $(`.gallery-link`).fadeIn(250);
        } else if (typeICON == "new-report-photo") {
            $(`.gallery-link`).fadeIn(250);
        } else if (typeICON == "new-user-photo") {
            $(`.gallery-link`).fadeIn(250);
        } else if (typeICON == "new-vehicle-photo") {
            $(`.gallery-link`).fadeIn(250);
        } else if (typeICON == "new-vehicle-tag") {
            $(`.tag-vehicle`).append(`<div class="veh-item" id="item-${randomID}"  contenteditable="true">Input Tags...</div>`);
        }
    } else {
        var time = ConvertTime(Date.now() / 1000);
        var caseNumber = Object.keys(MDT_DATA.bulletin_board).length == undefined ? 1 : Object.keys(MDT_DATA.bulletin_board).length  + 1
        $(`.bulletin-list`).prepend(`<div class="bulletin-item" id="bulletin-${randomID}">
            <div class="bulletin-header" contenteditable="true">Enter the header...</div>
            <div class="wanted-person-case">#${caseNumber}</div>

            <div class="bulletin-desc" contenteditable="true">Enter description..</div>

            <div class="bulletin-time"><b>${time.getUTCDate()}.${time.getUTCMonth()+1}.${time.getUTCFullYear()}</b> ${(time.getHours()<10?'0':'') + time.getHours()}:${(time.getMinutes()<10?'0':'') + time.getMinutes()} <i class="fas fa-clock"></i> </div>
        </div>`);
        editingBulletin = $(`#bulletin-${randomID}`);
        var bulletinData = {
            id: randomID,
            case: caseNumber,
            time: Date.now() * 1000,
        }

        $(`#bulletin-${randomID}`).data("bulletinData", bulletinData)
        
    }

    AudioPlay("sounds/click.wav", 0.5)
    SetupContextMenu();
});

$(" body ").on("keydown", function (e) {
    if (e.keyCode === 13) {
        if (editingBulletin != null) {
            var bulletinData =  $(editingBulletin).data("bulletinData");
            var header = $($(editingBulletin).find(".bulletin-header")).text();
            var desc = $($(editingBulletin).find(".bulletin-desc")).text();
            var time = ConvertTime(bulletinData.time / 1000);
            $(`.bulletin-list`).prepend(`<div class="bulletin-item" id="bulletin-${bulletinData.id}">
                <div class="bulletin-header" contenteditable="true">${header}</div>
                <div class="wanted-person-case">#${bulletinData.case}</div>

                <div class="bulletin-desc" contenteditable="true"><i class="fas fa-exclamation"></i> ${desc}</div>

                <div class="bulletin-time"><b>${time.getUTCDate()}.${time.getUTCMonth()+1}.${time.getUTCFullYear()}</b> ${time.getHours()}:${(time.getMinutes()<10?'0':'') + time.getMinutes()} <i class="fas fa-clock"></i> </div>
            </div>`);
            var newData = {
                identifier: bulletinData.id,
                header: header,
                caseNumber: bulletinData.case,
                desc: desc,
                time: bulletinData.time,
            }
            MDT_DATA.bulletin_board[bulletinData.id] = newData

            $.post("https://ls-mdt/saveData", JSON.stringify({
                NEW_DATA: newData,
                TYPE: "bulletin"
            }));

            $(editingBulletin).remove();
            editingBulletin = null;

            AudioPlay("sounds/click.wav", 0.5);
        } else if ( $(`.inc-char-table`).css("display") == "block" ) {
            $(".cur-holder").children().each(function(key, value) {
                $(`.crimes-inciden-list`).prepend(`<div class="veh-item">${$(value).html()}</div>`)
            });

            $(".inc-char-table").slideUp(500);
            $(".inc-char-table").fadeOut(500);
            $(".cur-holder").html("");

            AudioPlay("sounds/click.wav", 0.5)

            SetupContextMenu();
            SetFineAndSentence();
        } else if ( $(`.attached-units`).css("display") != "none" ) {
            $(`.attached-units`).fadeOut(250);
        } else if ( $(`.persons-department`).css("display") != "none" ) {
            $(`.persons-department`).fadeOut(250);
        } else if ($(`.grade-info`).css("display") != "none" ) {
            $(`.grade-info`).fadeOut(250);

            var setJobGrade = $(`.grade-list`).val();
            
            var unit = $(`#unit-${rightClickUnit}`).data("unitData")
            $.post("https://ls-mdt/setDepartment", JSON.stringify({
                    UNIT_DATA: unit,
                    NEW_GRADE: setJobGrade,
                    TYPE: "grade",
            }));
        }
    }
});

$(`.search-tab-input`).on("keydown", function (e) {
    if (e.keyCode === 13) {
        var thisClass = $(this)[0].classList[1]
        if (thisClass == "image-link") {
            var currentValue = $(this).val();
            $(this).val("");
            $(`.add-image-inp`).hide();
            $(`.gallery-add-buttons`).show();
            $(`.gallery-link`).fadeOut(250);
            AddImageToPage(PAGE, currentValue)
        } else if (thisClass == "radio-search") {
            var currentValue = $(this).val();
            $(this).val("");
            $(`.unit-info `).children().each(function(key, value) {
                $(value).hide();
            })
            $(`.unit-info `).fadeOut(250);

            if (isFloat(currentValue)) {
                var unit = $(`#unit-${rightClickUnit}`).data("unitData")
                unit.radio = currentValue,
                $.post("https://ls-mdt/setUnitData", JSON.stringify({
                    UNIT_DATA: unit,
                    TYPE: "set_radio",
                }));
            }
        } else if (thisClass == "callsign-search") {
            var currentValue = $(this).val();
            $(this).val("");
            $(`.unit-info `).children().each(function(key, value) {
                $(value).hide();
            })
            $(`.unit-info `).fadeOut(250);
            var unit = $(`#unit-${rightClickUnit}`).data("unitData")
            unit.callsign = currentValue,
            $.post("https://ls-mdt/setUnitData", JSON.stringify({
                UNIT_DATA: unit,
                TYPE: "set_callsign",
            }));
        }
    }
});

$(`.gallery-link`).on("keydown", function (e) {
    if (e.keyCode === 27) {
        $(`.add-image-inp`).hide();
        $(`.gallery-add-buttons`).show();
        $(`.gallery-link`).fadeOut(250);
    }
});

$(document).on("keydown", function(event) {
    if (event.repeat) {
        return;
    }
    if (event.keyCode == 27) {
        if ($(`.gallery-link`).css("display") != "none") {
            $(`.add-image-inp`).hide();
            $(`.gallery-add-buttons`).show();
            $(`.gallery-link`).fadeOut(250);
        }
    }
});

$(`.gallery-add`).click(function() {
    var thisClass = $(this)[0].classList[1]
    if (thisClass == "add-link") {
        $(`.gallery-add-buttons`).hide();
        $(`.add-image-inp`).show();
    } else if (thisClass == "add-capture") {
        $(`.add-image-inp`).hide();
        $(`.gallery-add-buttons`).show();
        $(`.gallery-link`).fadeOut(250);

        CloseMDTBCapture()
        $.post('https://ls-mdt/takePhoto',function(url){
            if(url){
                AddImageToPage(PAGE, url)
            }
        })
    }
});

function EnableEditAndSave() {
    $(".selected-page-item").each(function(key, value) {
        $(value).removeClass("selected-page-item")
    });

    $(`.button-edit`).removeClass("disabled-edit");
    $(`.button-save`).removeClass("disabled-edit");
    $(`.button-add`).addClass("disabled-edit");

    AudioPlay("sounds/click.wav", 0.5)
}

function AddToIncident(data) {
    if (selectedIdentifier != null) {
        data.identifier = selectedIdentifier
		data.caseNumber = MDT_DATA.incidents[selectedIdentifier].caseNumber
        MDT_DATA.incidents[selectedIdentifier] = data;
        $(`#incident-${data.identifier}`).html(`<div class="incident-record-name">${data.title}</div>
        <div class="incident-record-tof">${data.creatorIncident}</div>
        <div class="wanted-person-case">#${data.caseNumber}</div>`);
        $(`#incident-${data.identifier}`).data("incidentData", data);
        return;
    }

    MDT_DATA.incidents[data.identifier] = data;
    $(`.incident-list`).prepend(`<div class="incident-record" id="incident-${data.identifier}">
        <div class="incident-record-name">${data.title}</div>
        <div class="incident-record-tof">${data.creatorIncident}</div>
        <div class="wanted-person-case">#${data.caseNumber}</div>
    </div>`);
    $(`#incident-${data.identifier}`).data("incidentData", data);
    OpenIncident(data.identifier);
}


function UpdateIncident(data) {
    if( $(`#incident-${data.identifier}`).length ) {
        MDT_DATA.incidents[data.identifier] = data;
        $(`#incident-${data.identifier}`).html(`<<div class="incident-record-name">${data.title}</div>
            <div class="incident-record-tof">${data.creatorIncident}</div>
            <div class="wanted-person-case">#${data.caseNumber}</div>`);
        $(`#incident-${data.identifier}`).data("incidentData", data);
    } else {
        AddToIncident(data)
    }
}

function UpdateReport(data) {
    if( $(`#report-${data.identifier}`).length ) {
        MDT_DATA.incidents[data.identifier] = data;
        $(`#report-${data.identifier}`).html(`<<div class="incident-record-name">${data.title}</div>
            <div class="incident-record-tof">${data.creatorIncident}</div>
            <div class="wanted-person-case">#${data.caseNumber}</div>`);
        $(`#report-${data.identifier}`).data("reportData", data);
    } else {
        AddToReports(data)
    }
}

function UpdateBolo(data) {
    if( $(`#bolo-${data.identifier}`).length ) {
        MDT_DATA.incidents[data.identifier] = data;
        $(`#bolo-${data.identifier}`).html(`<<div class="incident-record-name">${data.title}</div>
            <div class="incident-record-tof">${data.creatorIncident}</div>
            <div class="wanted-person-case">#${data.caseNumber}</div>`);
        $(`#bolo-${data.identifier}`).data("boloData", data);
    } else {
        AddToBolo(data)
    }
}


function AddToReports(data) {
    if (selectedIdentifier != null) {
        data.identifier = selectedIdentifier
		data.caseNumber = MDT_DATA.reports[selectedIdentifier].caseNumber
        MDT_DATA.reports[selectedIdentifier] = data;
        $(`#report-${data.identifier}`).html(`<div class="incident-record-name">${data.title}</div>
        <div class="incident-record-tof">${data.creatorIncident}</div>
        <div class="wanted-person-case">#${data.caseNumber}</div>`);
        $(`#report-${data.identifier}`).data("reportData", data);
        return;
    }

    MDT_DATA.reports[data.identifier] = data
    $(`.report-list`).append(`<div class="incident-record" id="report-${data.identifier}">
        <div class="incident-record-name">${data.title}</div>
        <div class="incident-record-tof">${data.creatorIncident}</div>
        <div class="wanted-person-case">#${data.caseNumber}</div>
    </div>`);
    $(`#report-${data.identifier}`).data("reportData", data);
    OpenReport(data.identifier);
}

function AddToBolo(data) {
    
    if (selectedIdentifier != null) {
        data.identifier = selectedIdentifier
		data.caseNumber = MDT_DATA.bolo[selectedIdentifier].caseNumber
        MDT_DATA.bolo[selectedIdentifier] = data;
        $(`#bolo-${data.identifier}`).html(`<div class="incident-record-name">${data.title}</div>
        <div class="incident-record-tof">${data.creatorIncident}</div>
        <div class="wanted-person-case">#${data.caseNumber}</div>`);
        $(`#bolo-${data.identifier}`).data("boloData", data);
        return;
    }
    
    MDT_DATA.bolo[data.identifier] = data
    $(`.bolo-list`).append(`<div class="incident-record" id="bolo-${data.identifier}">
        <div class="incident-record-name">${data.title}</div>
        <div class="incident-record-tof">${data.creatorIncident}</div>
        <div class="wanted-person-case">#${data.caseNumber}</div>
    </div>`);
    $(`#bolo-${data.identifier}`).data("boloData", data);
    OpenBolo(data.identifier);
}

function Restart(savePAGE) {
    if (savePAGE == "page-incident") {
        ResetIncident();
        OpenPage(savePAGE);
    } else if(savePAGE == "page-reports") {
        ResetReports();
        OpenPage(savePAGE);
    } else if(savePAGE == "page-bolo") {
        ResetBOLO();
        OpenPage(savePAGE);
    }
    selectedIdentifier = null;
}

function changeValue(VALUE) {
    $(`.incident-record > .incident-record-name`).each(function(key, value) {
        var inc_title = $(value).text()

        var matchesRegex = inc_title.search(VALUE);

        if (matchesRegex == 0 || VALUE.length < 1)
            $($(value).parent()).show();
        else
            $($(value).parent()).hide();
    })

    $(`.profile-person > .profile-person-name`).each(function(key, value) {
        var inc_title = $(value).text()

        var matchesRegex = inc_title.search(VALUE);

        if (matchesRegex == 0 || VALUE.length < 1)
            $($(value).parent()).show();
        else
            $($(value).parent()).hide();
    })

    $(`.deparment-person > .profile-person-name`).each(function(key, value) {
        var inc_title = $(value).text()

        var matchesRegex = inc_title.search(VALUE);

        if (matchesRegex == 0 || VALUE.length < 1)
            $($(value).parent()).show();
        else
            $($(value).parent()).hide();
    })
}

function SavePage(savePAGE) {
    if (!$(`.button-edit`).hasClass("disabled-edit")) {
        ResetMDTValues();
        OpenPage(savePAGE)
        return; 
    }
    if (savePAGE == "page-incident") {
        var title = $(`.incident-title > b`).html().replaceAll("&nbsp;","");
        if (title.length == 0)
            return Restart(savePAGE);

        var time = $(`.incident-time > b`).html().replaceAll("&nbsp;","");
        if (time.length == 0)
            return Restart(savePAGE);
        
        var loc = $(`.incident-location > b`).html().replaceAll("&nbsp;","");
        if (loc.length == 0)
            return Restart(savePAGE);
    
    
        var crimecommit = MakeChilderenList($(`.crimes-inciden-list`).children());
        var crimeinc = MakeChilderenList($(`.crime-incident`).children());
        var officerinc = MakeChilderenList($(`.officer-incident`).children());
        var hostageinc = MakeChilderenList($(`.incident-hostage`).children());
        var weaponinc = MakeChilderenList($(`.weapons-incident-list`).children());
        var witnessinc = MakeChilderenList($(`.witness-list`).children());
        var galleryinc = MakeImageList($(`.gallery-incident`).children());
    
        var fineinc = $(`.fine-amount`).html();
        var sentenceinc = $(`.sentence-days`).html();
    
        var textcrime = $(`.text-crime`).val();

        var caseNumber = Object.keys(MDT_DATA.incidents).length == undefined ? 1 : Object.keys(MDT_DATA.incidents).length  + 1

        var incidentRecord = {
            identifier: makeid(22),

            title: title,
            time: time,
            location: loc,
            
            commitList: crimecommit,
            crimeList: crimeinc,

            officerList: officerinc,
            hostageList: hostageinc,
            witnessList: witnessinc,

            weponList: weaponinc,

            galleryList: galleryinc,

            fineAmount: fineinc,
            sentenceAmount: sentenceinc,

            caseNumber: caseNumber,
            creatorIncident: LoggedUser,

            description: textcrime
        }

        AddToIncident(incidentRecord);

        $.post("https://ls-mdt/saveData", JSON.stringify({
            NEW_DATA: incidentRecord,
            TYPE: "incident"
        }));

        ResetIncident();
        OpenPage(savePAGE)
    } else if (savePAGE == "page-reports") {
        var title = $(`.report-title > b`).html().replaceAll("&nbsp;","");
        if (title.length == 0)
            return Restart(savePAGE);

        var time = $(`.report-time > b`).html().replaceAll("&nbsp;","");
        if (time.length == 0)
            return Restart(savePAGE);
        
        var loc = $(`.report-location > b`).html().replaceAll("&nbsp;","");
        if (loc.length == 0)
            return Restart(savePAGE);
    
    
        var officerinc = MakeChilderenList($(`.officer-report`).children());
        var emergencyinc = MakeChilderenList($(`.emergency-report`).children());
        var taginc = MakeChilderenList($(`.tags-report`).children());
        var galleryinc = MakeImageList($(`.gallery-report`).children());
    
        var textcrime = $(`.text-report`).val();

        var caseNumber = Object.keys(MDT_DATA.reports).length == undefined ? 1 : Object.keys(MDT_DATA.reports).length + 1

        var isNonSolved = $($(`.status-reports`)[0]).hasClass("unresolved-rep")

        var reportRecord = {
            identifier: makeid(22),

            title: title,
            time: time,
            location: loc,
            
            officerList: officerinc,
            emergencyList: emergencyinc,
            tagsList: taginc,

            galleryList: galleryinc,

            caseNumber: caseNumber,
            creatorIncident: LoggedUser,

            description: textcrime,

            nonSolved: isNonSolved,
        }

        AddToReports(reportRecord);

        $.post("https://ls-mdt/saveData", JSON.stringify({
            NEW_DATA: reportRecord,
            TYPE: "report"
        }));

        ResetReports();
        OpenPage(savePAGE)
    } else if (savePAGE == "page-bolo") {
        var title = $(`.bolo-title > b`).html().replaceAll("&nbsp;","");
        if (title.length == 0)
            return Restart(savePAGE);

        var time = $(`.bolo-time > b`).html().replaceAll("&nbsp;","");
        if (time.length == 0)
            return Restart(savePAGE);
        
        var loc = $(`.bolo-location > b`).html().replaceAll("&nbsp;","");
        if (loc.length == 0)
            return Restart(savePAGE);

        var plate = $(`.bolo-plate > b`).html().replaceAll("&nbsp;","");
        if (loc.length == 0)
            return Restart(savePAGE);
    
    
        var officerinc = MakeChilderenList($(`.officer-bolo`).children());
        var tagsinc = MakeChilderenList($(`.tags-bolo`).children());
        var textcrime = $(`.text-bolo`).val();
        var galleryinc = MakeImageList($(`.gallery-bolo`).children());

        var caseNumber = Object.keys(MDT_DATA.bolo).length == undefined ? 1 : Object.keys(MDT_DATA.bolo).length + 1

        var isNonSolved = $($(`.status-bolos`)[0]).hasClass("unresolved-rep")

        var boloRecord = {
            identifier: makeid(22),

            title: title,
            time: time,
            location: loc,
            plate: plate,
            
            officerList: officerinc,
            tagsList: tagsinc,

            galleryList: galleryinc,

            caseNumber: caseNumber,
            creatorIncident: LoggedUser,

            description: textcrime,
            nonSolved: isNonSolved,
        }

        AddToBolo(boloRecord);

        $.post("https://ls-mdt/saveData", JSON.stringify({
            NEW_DATA: boloRecord,
            TYPE: "bolo"
        }));

        ResetBOLO();
        OpenPage(savePAGE)
    } else if (savePAGE == "page-profile") {
        var tagsinc = MakeChilderenList($(`.tags-list-user`).children());
        var gallery = MakeImageList($(`.image-gallery-user`).children());
        var licenses = ConvertLicenses($(`.license-item`));

        MDT_DATA.users[$(`.citizen-id > b`).html().replaceAll("&nbsp;","")].licenses = licenses;
        MDT_DATA.users[$(`.citizen-id > b`).html().replaceAll("&nbsp;","")].tags = tagsinc;
        MDT_DATA.users[$(`.citizen-id > b`).html().replaceAll("&nbsp;","")].gallery = gallery;
        MDT_DATA.users[$(`.citizen-id > b`).html().replaceAll("&nbsp;","")].profileimage = $(`.image-person > img`).attr("src");
        
        UpdateUser(MDT_DATA.users[$(`.citizen-id > b`).html().replaceAll("&nbsp;","")])

        $.post("https://ls-mdt/saveData", JSON.stringify({
            NEW_DATA: MDT_DATA.users[$(`.citizen-id > b`).html().replaceAll("&nbsp;","")],
            TYPE: "profile"
        }));

        ResetUserProfile();
        OpenPage(savePAGE)
    } else if (savePAGE == "page-car") {
        var tagsinc = MakeChilderenList($(`.tag-vehicle`).children());
        var gallery = MakeImageList($(`.gallery-vehicle`).children());

        MDT_DATA.vehicles[$(`.plate-id > b`).html().replaceAll("&nbsp;","")].tags = tagsinc;
        MDT_DATA.vehicles[$(`.plate-id > b`).html().replaceAll("&nbsp;","")].gallery = gallery;
        MDT_DATA.vehicles[$(`.plate-id > b`).html().replaceAll("&nbsp;","")].description = $(`.text-vehicle`).val();
        MDT_DATA.vehicles[$(`.plate-id > b`).html().replaceAll("&nbsp;","")].profileimage = $(`.image-vehicle > img`).attr("src");

        
        UpdateVehicle(MDT_DATA.vehicles[$(`.plate-id > b`).html().replaceAll("&nbsp;","")])

        $.post("https://ls-mdt/saveData", JSON.stringify({
            NEW_DATA: MDT_DATA.vehicles[$(`.plate-id > b`).html().replaceAll("&nbsp;","")],
            TYPE: "vehicle"
        }));

        ResetVehicleProfile();
        OpenPage(savePAGE)
    }
}

function ConvertLicenses(table) {
    var list = {}
    $.each(table, function(key, value) {
        list[$(value).html().toLowerCase()] = $(value).hasClass("y-lic") == true ? true : false
    })
    return list
}

function UpdateVehicle(DATA) {

    var foundWanted = false
    $.each(DATA.tags, function(key, value) {
        if (value.toLowerCase() == "stolen") {
            foundWanted = true;
        }
    })

    if (!foundWanted) {
        if ($($(`#vehicle-${DATA.identifier}`).find(`.profile-person-wanted`)).length)
            $($(`#vehicle-${DATA.identifier}`).find(`.profile-person-wanted`)).remove();

        if ($(`#wanted-v-${DATA.identifier}`).length)
            $(`#wanted-v-${DATA.identifier}`).remove();

    } else {
        if (!$($(`#vehicle-${DATA.identifier}`).find(`.profile-person-wanted`)).length) {
            $(`#vehicle-${DATA.identifier}`).append(`<div class="profile-person-wanted">STOLEN</div>`)
        }

        if (!$(`#wanted-v-${DATA.identifier}`).length) {
            AddVehicleToWantedList(DATA)
        }
    }

    $(`#vehicle-${DATA.identifier}`).data("vehicleData", DATA)
}

function UpdateUser(DATA) {

    var foundWanted = false
    $.each(DATA.tags, function(key, value) {
        if (value.toLowerCase() == "wanted") {
            foundWanted = true;
        }
    })

    if (!foundWanted) {
        if ($($(`#person-${DATA.identifier}`).find(`.profile-person-wanted`)).length)
            $($(`#person-${DATA.identifier}`).find(`.profile-person-wanted`)).remove();

        if ($(`#wanted-p-${DATA.identifier}`).length)
            $(`#wanted-p-${DATA.identifier}`).remove();

    } else {
        if (!$($(`#person-${DATA.identifier}`).find(`.profile-person-wanted`)).length) {
            $(`#person-${DATA.identifier}`).append(`<div class="profile-person-wanted">WANTED</div>`)
        }

        if (!$(`#wanted-p-${DATA.identifier}`).length) {
            AddPersonToWantedList(DATA)
        }
    }

    $(`#person-${DATA.identifier}`).data("userData", DATA)
}

function MakeImageList(chilc) {
    var ListChilderen = {}
    $.each(chilc, function(key ,value ) {
        ListChilderen[key] = $($(value).find("img")).attr("src")
    })
    return ListChilderen;
}

function MakeChilderenList(chilc) {
    var ListChilderen = {}
    $.each(chilc, function(key ,value ) {
        var key2 = key
        if ($(value).attr("id") != undefined)
            key2 = $(value).attr("id")
        ListChilderen[key2] = $(value).text()
    })
    return ListChilderen;
}

function CreatePage(CreatePAGE) {
    if (CreatePAGE == "page-incident") {
        ResetIncident();
    } else if (CreatePAGE == "page-reports") {
        ResetReports()
    } else if (CreatePAGE == "page-bolo") {
        ResetBOLO()
    } else if (CreatePAGE == "page-department") {
        $(`.persons-department`).fadeIn(250);
        $(`.person-to-add-department-list`).empty();
    
        $.each(MDT_DATA.users, function(key, value) { 
            if (value.user != undefined && value.identifier != MDT_DATA.currentuser.identifier && value.job.name == MDT_DATA.currentuser.job.name) {
                $(`.person-to-add-department-list`).prepend(`<div class="deparment-person" id="department-p-${value.identifier}">
                <div class="profile-person-image"><img src="debug_image/Katman 7.png" class="image-little"></div>
                <div class="profile-person-name">${value.charinfo.firstname} ${value.charinfo.lastname}</div>
        
                <div class="profile-person-citizen">Citizen ID<br><b>${value.identifier}</b></div>
        
                <div class="profile-person-job">Proffesion<br><b>${value.job.label} | ${value.job.grade}</b></div>

                <div class="profile-person-record">Records<br><b>Person have <span>${Object.keys(GetUserIncidentList(value.charinfo.firstname + " " + value.charinfo.lastname)).length}</span> record</b></div>
        
                ${IsWanted(value.tags) == true ? `<div class="profile-person-wanted">WANTED</div>` : ``}
            </div>`)
            $(`#department-p-${value.identifier}`).data("departmentData", value);
            ContextMenuDepartment(value.identifier)
            FindImage(value.profileimage, $($(`#department-p-${value.identifier}`).find(".profile-person-image > img")));
        
            }
        })
    }
}

function GetUserIncidentList(Fullname) {
    var incident = {}
    $.each(MDT_DATA.incidents, function(key, value) {
        $.each(value.crimeList, function(key2, value2) {
            if (value2 == Fullname) {
                incident[key] = value;
            }
        });
    });
    return incident
}

function ResetMDT() {
    $(`.list-dashb`).each(function(key, value) {
        $(value).html("");
    });

    $(`.dash-map-img`).css({"transform": "rotateZ(90deg) scale(3)", "top": "-70%", "left": "0%"});

    ResetMDTValues();
}

function ResetMDTValues() {
    ResetUserProfile();
    ResetIncident();
    ResetReports();
    ResetBOLO();
    ResetVehicleProfile();

    $(`.search-tab-input`).each(function(key, value) {
        $(value).val("")
    });

    $(`.incident-record`).each(function(key, value) {
        $(value).show();
    })

    $(`.profile-person`).each(function(key, value) {
        $(value).show();
    })

    $(".selected-page-item").each(function(key, value) {
        $(value).removeClass("selected-page-item")
    })
}

function ResetBOLO() {
    $(`.bolo-title`).html(`<i class="fas fa-pen"></i> BOLO Title<br><b contenteditable="true">                                                             </b><div class="line-info"></div>`);
    $(`.bolo-time`).html(`<i class="fas fa-clock"></i> BOLO Time<br><b contenteditable="true">                                                             </b><div class="line-info"></div>`);
    $(`.bolo-location`).html(`<i class="fas fa-map-marker-alt"></i> BOLO Location<br><b contenteditable="true">                                                             </b><div class="line-info"></div>`);
    $(`.bolo-plate`).html(`<i class="fas fa-address-card"></i> BOLO Plate<br><b contenteditable="true">                                                             </b><div class="line-info"></div>`);

    $(`.record-list`).html("");

    $(`.officer-bolo`).html("");
    $(`.tags-bolo`).html("");
    $(`.gallery-bolo`).html("");


    $(`.status-bolo`).html(`<div class="status-box status-bolos unresolved-rep">On Going</div>
    <div class="status-box status-bolos">Resolved</div>`)


    $(`.text-bolo`).val("");
    
    StatusBox();
}

function ResetReports() {
    $(`.report-title`).html(`<i class="fas fa-pen"></i> Report Title<br><b contenteditable="true">                                                             </b><div class="line-info"></div>`);
    $(`.report-time`).html(`<i class="fas fa-clock"></i> Report Time<br><b contenteditable="true">                                                             </b><div class="line-info"></div>`);
    $(`.report-location`).html(`<i class="fas fa-map-marker-alt"></i> Report Location<br><b contenteditable="true">                                                             </b><div class="line-info"></div>`);

    $(`.officer-report`).html("");
    $(`.emergency-report`).html("");
    $(`.tags-report`).html("");
    $(`.gallery-report`).html("");


    $(`.status-report`).html(`<div class="status-box status-reports unresolved-rep">On Going</div>
    <div class="status-box status-reports">Resolved</div>`)


    $(`.text-report`).val("");

    StatusBox();
}

function ResetIncident() {
    $(`.incident-title`).html(`<i class="fas fa-pen"></i> Incident Title<br><b contenteditable="true">                                                             </b><div class="line-info"></div>`);
    $(`.incident-time`).html(`<i class="fas fa-clock"></i> Incident Time<br><b contenteditable="true">                                                             </b><div class="line-info"></div>`);
    $(`.incident-location`).html(`<i class="fas fa-map-marker-alt"></i> Incident Location<br><b contenteditable="true">                                                             </b><div class="line-info"></div>`);


    $(`.crimes-inciden-list`).html("");
    $(`.crime-incident`).html("");
    $(`.officer-incident`).html("");
    $(`.incident-hostage`).html("");
    $(`.weapons-incident-list`).html("");
    $(`.witness-list`).html("");
    $(`.gallery-incident`).html("");

    $(`.fine-amount`).html("0$");
    $(`.sentence-days`).html("0");


    $(`.text-crime`).val(`Title: \nStore Robbing \nLocation: \nCriminal Weapons:\nHostage:\nCriminal Involved:\n\nCrimes Commited:\nPenalty Amount:\nDetention Period:\nWitness:\nEvidence:\n\nOfficers Involved:`);

    StatusBox();
}

function ResetUserProfile() {
    $(`.citizen-id`).html(`<i class="fas fa-address-card"></i> Citizen ID<br><div class="line-info"></div>`);
    $(`.forename`).html(`<i class="fas fa-user"></i> Forename<br><div class="line-info"></div>`);
    $(`.surname`).html(`<i class="fas fa-user"></i> Surname<br><div class="line-info"></div>`);
    $(`.dob`).html(`<i class="fas fa-calendar-alt"></i> Date of Birth<br><div class="line-info"></div>`);
    $(`.job`).html(`<i class="fas fa-briefcase"></i> Profession<br><div class="line-info"></div>`);
    $(`.profile-picture`).html(`<i class="fas fa-camera"></i> Profile Image<br><div class="line-info"></div>`);
    $(`.image-person > img`).attr("src", "https://t3.ftcdn.net/jpg/03/39/45/96/360_F_339459697_XAFacNQmwnvJRqe1Fe9VOptPWMUxlZP8.jpg");

    $(`.record-list`).html("");
    $(`.licenses-list`).html("");

    $.each(MDT_DATA.licenses, function(key, value) {
        $(`.licenses-list`).append(`<div class="license-item ${value}-license n-lic">${Capitalize(value)}</div>`);
    })
    
    $(`.veh-list`).html("");
    $(`.properties-list`).html("");
    $(`.tags-list-user`).html("");
    $(`.image-gallery-user`).html("");

    StatusBox();
}

function Capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function ResetVehicleProfile() {
    $(`.plate-id`).html(`<i class="fas fa-address-card"></i> Vehicle Plate<br><div class="line-info"></div>`);
    $(`.class`).html(`<i class="fas fa-compact-disc"></i> Vehicle Class<br><div class="line-info"></div>`);
    $(`.model`).html(`<i class="fas fa-car"></i> Vehicle Model<br><div class="line-info"></div>`);
    $(`.owner`).html(`<i class="fas fa-user"></i> Vehicle Owner<br><div class="line-info"></div>`);
    $(`.color`).html(`<i class="fas fa-spray-can"></i> Vehicle Color<br><div class="line-info"></div>`);
    $(`.profile-picture`).html(`<i class="fas fa-camera"></i> Profile Image<br><div class="line-info"></div>`);
    $(`.image-vehicle > img`).attr("src", "https://t3.ftcdn.net/jpg/03/39/45/96/360_F_339459697_XAFacNQmwnvJRqe1Fe9VOptPWMUxlZP8.jpg");

    $(`.tag-vehicle`).html("");
    $(`.gallery-vehicle`).html("");

    $(`.text-vehicle`).val("");

    StatusBox();
}

function DispatchItemContext() {
    $(`.dispatch-call-item`).unbind( "contextmenu" ).contextmenu(function(e) {
            if (IsInContextMenu) 
                return;

            var dispatchData = $(this).data("dispatchData");

            text = `<div class="item"><i class="fas fa-link"></i> <b>Attached Units</div>`
            
            var found = false
            $.each(dispatchData.units, function(key, value) {
                if (value.identifier == MDT_DATA.currentuser.identifier) {
                    found = true;
                    text += `<div class="item"><i class="fas fa-sign-out-alt"></i> <b>Detach</div>`
                }
            })

            if (!found)
                text += `<div class="item"><i class="fas fa-sign-in-alt"></i> <b>Respond</div>`

            text += `<div class="item"><i class="fas fa-map-marker-alt"></i> <b>Set Respond Waypoint</div>`

            $(`<div class="flip-in-hor-bottom" id="context-menu" >

            ${text}

            </div>`)
            .appendTo("body")
            .offset({left:e.pageX, top:e.pageY});
            IsInContextMenu = true

            rightClickDispatch = dispatchData
    });
}

function UnitContextItem(ID) {
    $(`#unit-${ID}`).contextmenu(function(e) {
        if (IsInContextMenu) 
            return;

            $(`<div class="flip-in-hor-bottom" id="context-menu" >

            <div class="item">
                <i class="fas fa-map-marker-alt"></i> <b>Set Waypoint
            </div>
            <div class="item">
                <i class="fas fa-broadcast-tower"></i> <b>Set Radio
            </div>
            <div class="item">
                <i class="fas fa-id-badge"></i> <b>Set Callsign
            </div>
            <div class="item">
                <i class="fas fa-thumbtack"></i> <b>Toggle Duty
            </div>

            </div>`)
            .appendTo("body")
            .offset({left:e.pageX, top:e.pageY});
            IsInContextMenu = true

            rightClickUnit = ID
    })
}

function DepartmentUnitContext(ID) {
    $(`#department-${ID}`).contextmenu(function(e) {
        if (IsInContextMenu || MDT_DATA.departments[MDT_DATA.currentuser.job.name].sherrifgrade != MDT_DATA.currentuser.job.grade.level) 
            return;

            $(`<div class="flip-in-hor-bottom" id="context-menu" >

            <div class="item">
                <i class="fas fa-star"></i> <b>Change Grade
            </div>
            <div class="item">
                <i class="fas fa-fire"></i> <b>Fire From Department
            </div>

            </div>`)
            .appendTo("body")
            .offset({left:e.pageX, top:e.pageY});
            IsInContextMenu = true

            rightClickUnit = ID
    })
}

function ContextMenuDepartment(ID) {
    $(`#department-p-${ID}`).unbind( "contextmenu" ).contextmenu(function(e) {
            if (IsInContextMenu) 
                return;

            if (PAGE != "page-incident") {
                $(`<div class="flip-in-hor-bottom" id="context-menu" >

                <div class="item">
                    <i class="fas fa-star"></i> <b>Give Job
                </div>
    
                </div>`)
                .appendTo("body")
                .offset({left:e.pageX, top:e.pageY});
                IsInContextMenu = true
    
                rightClickUnit = ID
            } else {
                $(`<div class="flip-in-hor-bottom" id="context-menu" >

                <div class="item">
                    <i class="fas fa-briefcase"></i> <b>Add To Crime
                </div>
    
                </div>`)
                .appendTo("body")
                .offset({left:e.pageX, top:e.pageY});
                IsInContextMenu = true
    
                rightClickUnit = ID
            }
    })
}

function AddToDepartment(value) {
    if (MDT_DATA.currentuser.department == value.department) {
        $(`.department-units`).append(`<div class="unit-item2" id="department-${value.identifier}">
        <div class="unit-name" style="top: 5.5%;">${value.name}</div>

        <div class="department-info">
            <div class="department-info-item"><i class="fas fa-address-card"></i> ID: <b>${value.identifier}</b></div>
            <div class="department-info-item"><i class="fas fa-address-book"></i> Responses: <b>${value.history.responded_week}</b></div>
            <div class="department-info-item"><i class="fas fa-city"></i> Department: <b style="color: var(--color-text-${value.department})">${value.department}</b></div>
            <div class="department-info-item"><i class="fas fa-id-briefcase"></i> Grade: <b>${MDT_DATA.users[value.identifier].job.grade}</b></div>
            <div class="department-info-item"><i class="fas fa-broadcast-tower"></i> Radio: <b>${value.radio}</b></div>
            <div class="department-info-item"><i class="fas fa-id-badge"></i> Callsign: <b>${value.callsign}</b></div>
            <div class="department-info-item"><i class="fas fa-id-badge"></i> Duty: <b style="color: var(--${value.onduty == true ? "color-charge-green" : "color-charge-red"})">${value.onduty == true ? "ONDUTY" : "OFFDUTY"}</b></div>
        </div>
    </div>`);
    $(`#department-${value.identifier}`).data("unitData", value)
    DepartmentUnitContext(value.identifier)
    }
}

function AddToActiveUnit(value) {
    $(`.active-unit-list`).append(`<div class="unit-item" id="unit-${value.identifier}">
        <div class="unit-name">${value.name}</div>

        <div class="unit-radio">${value.radio}</div>

        <div class="unit-callsign">${value.callsign}</div>

        <div class="unit-department department-${value.department}">${value.department}</div>
        <div class="unit-status ${value.onduty == true ? "status-on" : "status-off"}">${value.onduty == true ? "ONDUTY" : "OFFDUTY"}</div>
    </div>`);
    $(`#unit-${value.identifier}`).data("unitData", value)
    UnitContextItem(value.identifier)
}

function UpdateActiveUnit(value) {
    $(`#unit-${value.identifier}`).html(`<div class="unit-name">${value.name}</div>

        <div class="unit-radio">${value.radio}</div>

        <div class="unit-callsign">${value.callsign}</div>

        <div class="unit-department department-${value.department}">${value.department}</div>
        <div class="unit-status ${value.onduty == true ? "status-on" : "status-off"}">${value.onduty == true ? "ONDUTY" : "OFFDUTY"}</div>`);
    $(`#unit-${value.identifier}`).data("unitData", value)
}

function AddToUsers(value) {
    $(`.profile-list`).append(`<div class="profile-person" id="person-${value.identifier}">
        <div class="profile-person-image"><img src="debug_image/Katman 7.png" class="image-little"></div>
        <div class="profile-person-name">${value.charinfo.firstname} ${value.charinfo.lastname}</div>

        <div class="profile-person-citizen">Citizen ID<br><b>${value.identifier}</b></div>

        <div class="profile-person-job">Proffesion<br><b>${value.job.label} | ${value.job.grade}</b></div>

        <div class="profile-person-record">Records<br><b>Person have <span>${Object.keys(GetUserIncidentList(value.charinfo.firstname + " " + value.charinfo.lastname)).length}</span> record</b></div>

        ${IsWanted(value.tags) == true ? `<div class="profile-person-wanted">WANTED</div>` : ``}
    </div>`);
    $(`#person-${value.identifier}`).data("userData", value);
    OpenUser(value.identifier)
    FindImage(value.profileimage, $($(`#person-${value.identifier}`).find(".profile-person-image > img")));
}

function AddToVehicle(value) {
    $(`.vehicle-list`).append(`<div class="profile-person" id="vehicle-${value.identifier}">
        <div class="profile-person-image"><img src="debug_image/Katman 7.png" class="image-little"></div>
        <div class="profile-person-name">${value.identifier}</div>

        <div class="profile-person-citizen">Model<br><b>${value.model}</b></div>

        <div class="profile-person-job">Class<br><b>${value.class}</b></div>

        ${IsStolen(value.tags) == true ? `<div class="profile-person-wanted">STOLEN</div>` : ``}
    </div>`);
    $(`#vehicle-${value.identifier}`).data("vehicleData", value);
    OpenVehicle(value.identifier);
    FindImage(value.profileimage, $($(`#vehicle-${value.identifier}`).find(".profile-person-image > img")));
}

function AddToBulletin(DATA) {
    var time = ConvertTime(DATA.time);
    $(`.bulletin-list`).append(`<div class="bulletin-item">
        <div class="bulletin-header">${DATA.header}</div>
        <div class="wanted-person-case">#${DATA.caseNumber}</div>

        <div class="bulletin-desc"><i class="fas fa-exclamation"></i> ${DATA.desc}</div>

        <div class="bulletin-time"><b>${time.getUTCDate()}.${time.getUTCMonth()+1}.${time.getUTCFullYear()}</b> ${time.getHours()}:${time.getMinutes()} <i class="fas fa-clock"></i> </div>
    </div>`);
}

function SetupMDT(data) {
    MDT_DATA = data;
    ResetMDT();

    OpenPage("page-dashboard")

    LoggedUser = MDT_DATA.currentuser.charinfo.firstname + " " + MDT_DATA.currentuser.charinfo.lastname
    
    $(`.mdt-department-officer`).html(LoggedUser)
	
	let BULLETIN_SORT = Object.values(MDT_DATA.bulletin_board).sort((a, b) => b.caseNumber - a.caseNumber)
    $.each(BULLETIN_SORT, function(key, value) {
        AddToBulletin(value)
    });

    $.each(MDT_DATA.employees, function(key, value) {
        value.identifier = key
        AddToActiveUnit(value)

        AddToDepartment(value)
    });

    $.each(MDT_DATA.users, function(key, value) {
        AddToUsers(value)
    });
    $.each(MDT_DATA.vehicles, function(key, value) {
        AddToVehicle(value)
    });
	
	let INCIDENT_SORT = Object.values(MDT_DATA.incidents).sort((a, b) => a.caseNumber - b.caseNumber)
    $.each(INCIDENT_SORT, function(key, value) {
        AddToIncident(value);
    });
	
	let REPORT_SORT = Object.values(MDT_DATA.reports).sort((a, b) => b.caseNumber - a.caseNumber)
    $.each(REPORT_SORT, function(key, value) {
        AddToReports(value);
    });
	
	let BOLO_SORT = Object.values(MDT_DATA.bolo).sort((a, b) => b.caseNumber - a.caseNumber)
	$.each(BOLO_SORT, function(key, value) {
        AddToBolo(value);
    });
	
    $.each(MDT_DATA.users, function(key, value) {
        $.each(value.tags, function(_, value2) {
            if (value2.toLowerCase() == "wanted") {
                AddPersonToWantedList(value)
            }
        });
    });

    $.each(MDT_DATA.vehicles, function(key, value) {
        $.each(value.tags, function(_, value2) {
            if (value2.toLowerCase() == "stolen") {
                AddVehicleToWantedList(value)
            }
        });
    });

    ClearMap()

    $.each(MDT_DATA.dispatchs, function(key, value) {
        AddItemToDispatch(value);
    });
}

function OrderListByCaseNumber(table) {
	let sortList = Object.values(data.transactions).sort((a, b) => b.date - a.date)
}

function CreateDispatchInner(value) {
    var text = `<div class="dispatch-info-hold">`

    var time = new Date(value.time)

    if (time)
        text += `<div class="dispatch-info-item"><i class="fas fa-clock"></i> ${TimeAgo(value.time)}</div>`
    if (value.firstStreet)
        text += `<div class="dispatch-info-item"><i class="fas fa-map-marker-alt"></i> ${value.firstStreet}</div>`
    if (value.weapon)
    text += `<div class="dispatch-info-item""><i class="fas fa-bullseye"></i>${value.weapon}</div>`
    if (value.gender)
        text += `<div class="dispatch-info-item""><i class="fas fa-genderless"></i>${value.gender}</div>`


    if (value.model)
        text += `<div class="dispatch-info-item"><i class="fas fa-cog"></i> ${value.model}</div>`

    if (value.model && value.plate)
        text += `<div class="dispatch-info-item"><i class="fas fa-id-car"></i>${value.model}<i class="fas fa-digital-tachograp" style="margin-left: 2vh;"></i>${value.plate}</div>`
    else if (value.plate)
        text += `<div class="dispatch-info-item"><i class="fas fa-digital-tachograp"></i>${value.plate}</div>`
    else if (value.model)
        text += `<div class="dispatch-info-item"><i class="fas fa-id-car"></i>${value.model}</div>`

    if (value.firstColor)
        text += `<div class="dispatch-info-item"><i class="fas fa-spray-can"></i> ${value.firstColor}</div>`

    if (value.automaticGunfire)
        text += `<div class="dispatch-info-item"><i class="fas fa-cog"></i> Full Automatic Rifle</div>`

    if (value.name && value.number)
        text += `<div class="dispatch-info-item"><i class="fas fa-id-badge"></i>${value.name}<i class="fas fa-mobile-alt" style="margin-left: 2vh;"></i>${value.number}</div>`
    else if (value.number)
        text += `<div class="dispatch-info-item"><i class="fas fa-mobile-alt"></i>${value.number}</div>`
    else if (value.name)
        text += `<div class="dispatch-info-item"><i class="fas fa-id-badge"></i>${value.name}</div>`

    text += "</div>"

    return text;
}

function AddItemToDispatch(value) {
    
    $(`.dispatch-list`).prepend(`<div class="dispatch-call-item" id="dispatch-item-dashboard-${value.callId}">
        <div class="dispatch-respond-call">${Object.keys(value.units).length}</div>
        <div class="dispatch-name-call">${value.dispatchMessage}</div>

        <div class="wanted-vehicle-case">#${value.callId}</div>
        ${CreateDispatchInner(value)}
    </div>`);
    $(`#dispatch-item-dashboard-${value.callId}`).data("dispatchData", value);

    $(`.dispatch-list-calls`).prepend(`<div class="dispatch-call-item" id="dispatch-item-${value.callId}">
        <div class="dispatch-respond-call">${Object.keys(value.units).length}</div>
        <div class="dispatch-name-call">${value.dispatchMessage}</div>

        <div class="wanted-vehicle-case">#${value.callId}</div>
        ${CreateDispatchInner(value)}
    </div>`);
    $(`#dispatch-item-${value.callId}`).data("dispatchData", value);

    DispatchMAP(value);
    DispatchItemContext();
}

function AddPersonToWantedList(DATA) {
    $(`.wanted-person-list`).prepend(`<div class="wanted-person" id="wanted-p-${DATA.identifier}">
        <div class="wanted-person-name"><i class="fas fa-user"></i> ${DATA.charinfo.firstname} ${DATA.charinfo.lastname}</div>
        <div class="profile-person-wanted">WANTED</div>
    </div>`);
}

function AddVehicleToWantedList(DATA) {
    $(`.wanted-vehicle-list`).prepend(`<div class="wanted-person" id="wanted-v-${DATA.identifier}">
        <div class="wanted-person-name"><i class="fas fa-car"></i> ${DATA.identifier}</div>
        <div class="profile-person-wanted">STOLEN</div>
    </div>`);
}

function FindPersonArrested() {

}

function OpenVehicle(key) {
    $(`#vehicle-${key}`).click(function() {
        EnableEditAndSave();

        ResetVehicleProfile()
        $(`#vehicle-${key}`).addClass("selected-page-item");
        var vehicleData = $(this).data("vehicleData");

        selectedIdentifier = vehicleData.identifier

        $(`.plate-id`).html(`<i class="fas fa-address-card"></i> Vehicle Plate<br>       <b>${vehicleData.identifier}</b><div class="line-info"></div>`);
        $(`.class`).html(`<i class="fas fa-compact-disc"></i> Vehicle Class<br>       <b>${vehicleData.class}</b><div class="line-info"></div>`);
        $(`.model`).html(`<i class="fas fa-car"></i> Vehicle Model<br>       <b>${vehicleData.model}</b><div class="line-info"></div>`);
        $(`.owner`).html(`<i class="fas fa-user"></i> Vehicle Owner<br>       <b>${vehicleData.owner}</b><div class="line-info"></div>`);
        $(`.color`).html(`<i class="fas fa-spray-can"></i> Vehicle Color<br>       <b>${vehicleData.color}</b><div class="line-info"></div>`);
        $(`.profile-picture`).html(`<i class="fas fa-camera"></i> Vehicle Image<br>       <b>${vehicleData.profileimage}</b><div class="line-info"></div>`);
        FindImage(vehicleData.profileimage, $(`.image-vehicle > img`));
    
        $(`.text-vehicle`).val(vehicleData.description);

        $.each(vehicleData.tags, function(key, value) {
            $(`.tag-vehicle`).append(`<div class="veh-item" id="tag-${value}">${value}</div>`)
        });

        $.each(vehicleData.gallery, function(key, value) {
            $(`.gallery-vehicle`).append(`<div class="image-gallery"><img src="${value}"></div>`)
        });
        SetupContextMenu();
    })
}

function ClickAndOpenVehItem(id, type) {
    if (type == "incident" && MDT_DATA.users[id] != undefined) {
        $(`#item-${id}`).unbind( "click" ).click(function() {
            OpenPage("page-profile");

            OpenUserPage(id);
        })
    } else if (type == "profile" && MDT_DATA.incidents[id] != undefined) {
        $(`#item-${id}`).unbind( "click" ).click(function() {
            OpenPage("page-incident");

            OpenIncidentPage(id);
        })
    }
}

function OpenUserPage(id) {
    EnableEditAndSave();

    ResetUserProfile()
    $(`#person-${id}`).addClass("selected-page-item");

    var userData = $(`#person-${id}`).data("userData");

    selectedIdentifier = userData.identifier

    $(`.citizen-id`).html(`<i class="fas fa-address-card"></i> Citizen ID<br>       <b>${userData.identifier}</b><div class="line-info"></div>`);
    $(`.forename`).html(`<i class="fas fa-user"></i> Forename<br>       ${userData.charinfo.firstname}<div class="line-info"></div>`);
    $(`.surname`).html(`<i class="fas fa-user"></i> Surname<br>       ${userData.charinfo.lastname}<div class="line-info"></div>`);
    $(`.dob`).html(`<i class="fas fa-calendar-alt"></i> Date of Birth<br>       ${userData.charinfo.dob}<div class="line-info"></div>`);
    $(`.job`).html(`<i class="fas fa-briefcase"></i> Profession<br>       ${userData.job.label} | ${userData.job.grade}<div class="line-info"></div>`);
    $(`.profile-picture`).html(`<i class="fas fa-camera"></i> Profile Image<br>       ${userData.profileimage}<div class="line-info"></div>`);
    FindImage(userData.profileimage, $(`.image-person > img`));


    $(`.record-list`).html("");

    $.each(GetUserIncidentList(userData.charinfo.firstname + " " + userData.charinfo.lastname), function(key, value){
        $(`.record-list`).append(`<div class="record-item" id="item-${value.identifier}"><i class="fas fa-folder record-folder"></i> <div class="profile-person-name" style="top: 50%; transform: translateY(-50%);">${value.title}</div> <div class="wanted-person-case" style="top: 50%; transform: translateY(-50%);">#${value.caseNumber}</div></div>`);
        ClickAndOpenVehItem(value.identifier, "profile")
    })

    $(`.licenses-list`).html("");
    $.each(MDT_DATA.licenses, function(key, value) {
        $(`.licenses-list`).append(`<div class="license-item ${value}-license n-lic">${Capitalize(value)}</div>`);
    })

    $.each(userData.licenses, function(key, value) {
        if (value) {
            $(`.${key}-license`).removeClass("n-lic").addClass("y-lic");
        }
    });

    $.each(userData.vehicles, function(key, value) {
        $(`.veh-list`).append(`<div class="veh-item">${value}</div>`);
    });

    $.each(userData.properties, function(key, value) {
        $(`.properties-list`).append(`<div class="veh-item">${value}</div>`);
    });

    $.each(userData.tags, function(key, value) {
        $(`.tags-list-user`).append(`<div class="veh-item" id="tag-${value}">${value}</div>`)
    });

    $.each(userData.gallery, function(key, value) {
        $(`.image-gallery-user`).append(`<div class="image-gallery"><img src="${value}"></div>`)
    });
    SetupContextMenu();
}

function OpenUser(key) {
    $(`#person-${key}`).click(function() {
        OpenUserPage(key)
    })
}

function OpenIncidentPage(key) {
    EnableEditAndSave();

    ResetIncident()
    $(`#incident-${key}`).addClass("selected-page-item");
    var incidentData = $(`#incident-${key}`).data("incidentData");

    selectedIdentifier = incidentData.identifier

    $(`.incident-title`).html(`<i class="fas fa-pen"></i> Incident Title<br><b contenteditable="true">${incidentData.title}</b><div class="line-info"></div>`);
    $(`.incident-time`).html(`<i class="fas fa-clock"></i> Incident Time<br><b contenteditable="true">${incidentData.time}</b><div class="line-info"></div>`);
    $(`.incident-location`).html(`<i class="fas fa-map-marker-alt"></i> Incident Location<br><b contenteditable="true">${incidentData.location}</b><div class="line-info"></div>`);
    
    $.each(incidentData.weponList, function(key, value) {
        $(`.weapons-incident-list`).append(`<div class="veh-item">${value}</div>`)
    });

    $.each(incidentData.hostageList, function(key, value) {
        $(`.incident-hostage`).append(`<div class="veh-item">${value}</div>`)
    });

    $.each(incidentData.officerList, function(key, value) {
        $(`.officer-incident`).append(`<div class="veh-item">${value}</div>`)
    });
    
    $.each(incidentData.commitList, function(key, value) {
        $(`.crimes-inciden-list`).append(`<div class="veh-item">${value}</div>`)
    });
    
    $.each(incidentData.crimeList, function(key, value) {
        $(`.crime-incident`).append(`<div class="veh-item" id="${key}">${value}</div>`);
        ClickAndOpenVehItem(key.replace("item-", ""), "incident")
    });
    
    $.each(incidentData.witnessList, function(key, value) {
        $(`.witness-list`).append(`<div class="veh-item">${value}</div>`)
    });
    $.each(incidentData.galleryList, function(key, value) {
        $(`.gallery-incident`).append(`<div class="image-little-gallery"><img src="${value}"></div>`)
    });


    $(`.text-crime`).val(incidentData.description);
    SetupContextMenu();
    SetFineAndSentence();
}

function OpenIncident(key) {
    $(`#incident-${key}`).click(function() {
        OpenIncidentPage(key)
    })
}

function OpenBolo(key) {
    $(`#bolo-${key}`).click(function() {
        EnableEditAndSave();

        ResetBOLO()
        $(`#bolo-${key}`).addClass("selected-page-item");
        var boloData = $(this).data("boloData");

        selectedIdentifier = boloData.identifier

        $(`.bolo-title`).html(`<i class="fas fa-pen"></i> BOLO Title<br><b contenteditable="true">${boloData.title}</b><div class="line-info"></div>`);
        $(`.bolo-time`).html(`<i class="fas fa-clock"></i> BOLO Time<br><b contenteditable="true">${boloData.time}</b><div class="line-info"></div>`);
        $(`.bolo-location`).html(`<i class="fas fa-map-marker-alt"></i> BOLO Location<br><b contenteditable="true">${boloData.location}</b><div class="line-info"></div>`);
        $(`.bolo-plate`).html(`<i class="fas fa-adress-card"></i> BOLO Plate<br><b contenteditable="true">${boloData.location}</b><div class="line-info"></div>`);

        $.each(boloData.tagsList, function(key, value) {
            $(`.tags-bolo`).append(`<div class="veh-item">${value}</div>`)
        });

        $.each(boloData.officerList, function(key, value) {
            $(`.officer-bolo`).append(`<div class="veh-item">${value}</div>`)
        });
        
        $.each(boloData.galleryList, function(key, value) {
            $(`.gallery-bolo`).append(`<div class="image-little-gallery"><img src="${value}"></div>`)
        });

        if (boloData.nonSolved) {
            $($(`.status-bolos`)[0]).addClass("unresolved-rep")
            $($(`.status-bolos`)[1]).removeClass("resolved-rep")
        } else {
            $($(`.status-bolos`)[0]).removeClass("unresolved-rep")
            $($(`.status-bolos`)[1]).addClass("resolved-rep")
        }
    
    
        $(`.text-bolo`).val(boloData.description);
        SetupContextMenu();
    })
}

function OpenReport(key) {
    $(`#report-${key}`).click(function() {
        EnableEditAndSave();

        ResetReports()
        $(`#report-${key}`).addClass("selected-page-item");
        var reportData = $(this).data("reportData");

        selectedIdentifier = reportData.identifier

        $(`.report-title`).html(`<i class="fas fa-pen"></i> Incident Title<br><b contenteditable="true">${reportData.title}</b><div class="line-info"></div>`);
        $(`.report-time`).html(`<i class="fas fa-clock"></i> Incident Time<br><b contenteditable="true">${reportData.time}</b><div class="line-info"></div>`);
        $(`.report-location`).html(`<i class="fas fa-map-marker-alt"></i> Incident Location<br><b contenteditable="true">${reportData.location}</b><div class="line-info"></div>`);
    
        
        $.each(reportData.tagsList, function(key, value) {
            $(`.tags-report`).append(`<div class="veh-item">${value}</div>`)
        });

        $.each(reportData.emergencyList, function(key, value) {
            $(`.emergency-report`).append(`<div class="veh-item">${value}</div>`)
        });

        $.each(reportData.officerList, function(key, value) {
            $(`.officer-report`).append(`<div class="veh-item">${value}</div>`)
        });
        
        $.each(reportData.galleryList, function(key, value) {
            $(`.gallery-report`).append(`<div class="image-little-gallery"><img src="${value}"></div>`)
        });

        if (reportData.nonSolved) {
            $($(`.status-reports`)[0]).addClass("unresolved-rep")
            $($(`.status-reports`)[1]).removeClass("resolved-rep")
        } else {
            $($(`.status-reports`)[0]).removeClass("unresolved-rep")
            $($(`.status-reports`)[1]).addClass("resolved-rep")
        }
    
    
        $(`.text-report`).val(reportData.description);
        SetupContextMenu();
    })
}

setInterval(EditTime, 1000);

function EditTime() {
    var time = new Date();
    $(`.mdt-clock`).html(`<span class="time-clock"><b>${time.getUTCDate()}.${time.getUTCMonth()+1}.${time.getFullYear()}</b><br>${(time.getHours()<10?'0':'') + time.getHours()}:${(time.getMinutes()<10?'0':'') + time.getMinutes()}:${(time.getSeconds()<10?'0':'') + time.getSeconds()}</span><i class="fas fa-wifi"></i>`)
}

function IsWanted(tags) {
    var isWant = false
    $.each(tags, function(key, value) {
        if (value == "Wanted")
            isWant = true;
    })

    return isWant;
}

function IsStolen(tags) {
    var isWant = false
    $.each(tags, function(key, value) {
        if (value == "Stolen")
            isWant = true;
    })

    return isWant;
}

function ConvertTime(time) {
    var myDate = new Date( time * 1000);
    return myDate
}

function FindImage(name, objectChange) {
    $("#imagecheck").load(name, function(response, status, xhr) {
        $("#imagecheck").html("")
        if (status != "error") {
            $(objectChange).attr("src", name)
        } else {
            $(objectChange).attr("src", "https://t3.ftcdn.net/jpg/03/39/45/96/360_F_339459697_XAFacNQmwnvJRqe1Fe9VOptPWMUxlZP8.jpg")
        }
    });
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function AudioPlay(name, volume) {
    $("#soundcheck").load(name, function(response, status, xhr) {
        $("#soundcheck").html("")
        if (status != "error") {
            var sound = new Audio(name);

            if (volume == undefined)
                volume = 1.0;
            sound.volume = volume;
            sound.play();
            return sound;
        }
    });
}

$(document).on("keydown", function(event) {
    if (event.repeat) {
        return;
    }
    switch (event.keyCode) {
        case 27: // ESC
            CloseMDT();
            break;
    }
});

$(`.mdt-close`).click(function(){
    CloseMDT()
})

function CloseMDT() {
    OpenPage("page-dashboard")

    $(`.mdt-frame`).fadeOut(500);

    $(`.unit-info `).hide();
    $(`.unit-info `).children().each(function(key, value) {
        $(value).hide();
    })

    $(".inc-char-table").slideUp(500);
    $(".inc-char-table").fadeOut(500);
    $(".cur-holder").html("");

    $(`.attached-units`).fadeOut(250);
    $(`.persons-department`).fadeOut(250);
    $(`.grade-info`).fadeOut(250);

    IsInContextMenu = false
    $("#context-menu").remove();

    $.post("https://ls-mdt/closeNUI", JSON.stringify({}));
}

function CloseMDTBCapture() {

    $(`.mdt-frame`).fadeOut(500);

    $(`.unit-info `).hide();
    $(`.unit-info `).children().each(function(key, value) {
        $(value).hide();
    })

    $(".inc-char-table").slideUp(500);
    $(".inc-char-table").fadeOut(500);
    $(".cur-holder").html("");

    $(`.attached-units`).fadeOut(250);
    $(`.persons-department`).fadeOut(250);
    $(`.grade-info`).fadeOut(250);

    IsInContextMenu = false
    $("#context-menu").remove();

    $.post("https://ls-mdt/closeNUI", JSON.stringify({}));
}

function OpenMDT() {
    OpenPage("page-dashboard")
    ResetMDT();

    $(`.mdt-frame`).fadeIn(500);
}

function UpdateDispatch(value) {
    $(`#dispatch-item-dashboard-${value.callId}`).html(`<div class="dispatch-respond-call">${Object.keys(value.units).length}</div>
    <div class="dispatch-name-call">${value.dispatchMessage}</div>

    <div class="wanted-vehicle-case">#${value.callId}</div>
    ${CreateDispatchInner(value)}`);
    $(`#dispatch-item-dashboard-${value.callId}`).data("dispatchData", value);

    $(`#dispatch-item-${value.callId}`).html(`<div class="dispatch-respond-call">${Object.keys(value.units).length}</div>
    <div class="dispatch-name-call">${value.dispatchMessage}</div>

    <div class="wanted-vehicle-case">#${value.callId}</div>
    ${CreateDispatchInner(value)}`);
    $(`#dispatch-item-${value.callId}`).data("dispatchData", value);
}

$(document).ready(function (){
    window.addEventListener('message', function (event) {
        var data = event.data
        if (data.action == "ui") {
            if (data.type) {
                OpenMDT();

                SetupMDT(data.MDT_DATA);
            } else {
                CloseMDT();
            }
        } else if (data.action == "ui_partly") {
            if (data.type) {
                $(`.mdt-frame`).fadeIn(500);
            }
        }
        else if (data.action == "setUnitData") {
            UpdateActiveUnit(data.INFO.UNIT_DATA)
        } else if (data.action == "saveData") {
            var SAVE_DATA = data.INFO;

            if (SAVE_DATA.TYPE == "incident") 
                UpdateIncident(SAVE_DATA.NEW_DATA)
            else if (SAVE_DATA.TYPE == "report")
                UpdateReport(SAVE_DATA.NEW_DATA)
            else if (SAVE_DATA.TYPE == "bolo")
                UpdateBolo(SAVE_DATA.NEW_DATA)
            else if (SAVE_DATA.TYPE == "profile")
                UpdateUser(SAVE_DATA.NEW_DATA)
            else if (SAVE_DATA.TYPE == "vehicle")
                UpdateVehicle(SAVE_DATA.NEW_DATA)

        } else if (data.action == "newCallAdd") {
            AddItemToDispatch(data.data)
        } else if (data.action == "updateDispatch") {
            UpdateDispatch(data.NEW_DATA)
        } else if (data.action == "respondToCall") {
            var NEW_DATA_UNIT = RespondUpdate("add")

            $.post("https://ls-mdt/setUnitData", JSON.stringify({
                UNIT_DATA: NEW_DATA_UNIT,
                TYPE: "radio",
            }));

        }
    })
});






























var MONTH_NAMES = [
	'Jan.',
	'Feb.',
	'Mar.',
	'Apr.',
	'May.',
	'June',
	'July',
	'Aug.',
	'Sept.',
	'Oct.',
	'Nov.',
	'Dec.',
];

function TimeAgo(dateParam) {
	if (!dateParam)
		return;

	var date = new Date(dateParam),
	    TOD = new Date(),
	    SECS = Math.round((TOD - date) / 1000);

	if (SECS < 15)
		return 'Just now';
	else if (SECS < 60)
		return `${SECS} seconds ago`;
	else if (SECS < 90)
		return 'About a minute ago';
	else if (Math.round(SECS / 60) < 60)
		return `${Math.round(SECS / 60)} minutes ago`;
	else if (TOD.toDateString() === date.toDateString())
		return 'Today';
	else if (new Date(TOD - 86400000).toDateString() === date.toDateString())
		return 'Yesterday';
	else if (TOD.getFullYear() === date.getFullYear()) {
	    return `${date.getDate()}. ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}. at ${(date.getHours()<10?'0':'') + date.getHours()}:${(date.getMinutes()<10?'0':'') + date.getMinutes()}`;
    }

	return date;
}