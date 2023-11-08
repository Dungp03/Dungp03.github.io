/////////////////////   Client
let localStream;
let remoteStream;
// var peer = null;
const peer = new Peer();
let isCameraOn = true;
const socket = io('https://wrtc-demo-72673597876c.herokuapp.com');

// Đảm bảo rằng đoạn mã javacript đã được thực thi khi DOM đc hoành thành
$(document).ready(function() {
    // Create a new Peer instance

    try {
        peer = new Peer(null, {
            host: "localhost",
            port: 9090,
            path: "/peerserver",
        });
    } catch (error) {
        console.error('Error initializing Peer:', error);
    }

    peer.on('open', function(id) {
        // Display the peer ID in the 'mydiv' element
        $("#mydiv").text("Your ID: " + id);
        console.log("Your ID: " + id);

        $('#btnSignUp').click(() => {
            const username = $('#txtUsername').val();
            socket.emit('NGUOI_DUNG_DANG_KY', {name: username, peerId: id});
        });
    });

    

    $('#div-chat').hide();

    socket.on('DANH_SACH_ONLINE', arrUserInfo => {
        $('#div-chat').show();
        $('#div-dang-ky').hide();

        arrUserInfo.forEach(user => {
            const {name, peerId} = user;
            $('#ulUser').append(`<li id="${peerId}">${name}</li>`);
        });

        socket.on('CO_NGUOI_DUNG_MOI', user => {
            const {name, peerId} = user;
            $('#ulUser').append(`<li id="${peerId}">${name}</li>`);
        });

        socket.on('USER_DISCONNECTED', peerId => {
            $(`#${peerId}`).remove(); //goi dc $ o peeerId vi da cho peerId vao tung the <li></li>
        });
    });

    socket.on('DANG_KY_THAT_BAI', () => alert('Vui long chon username khac!'));


    function openStream() {
        const config = { audio: true, video: true };
        return navigator.mediaDevices.getUserMedia(config);
    }

    function playStream(idVideoTag, stream) {
        const video = document.getElementById(idVideoTag);
        video.srcObject = stream;
        video.play();
    }

    openStream().then(stream => {
        localStream = stream;
        playStream('localStream', localStream)
    });
    

    // Bật/tắt camera
    function toggleCamera(){
        isCameraOn = !isCameraOn;
        localStream.getVideoTracks()[0].enabled = isCameraOn;
        const cameraIcon = document.querySelector('#cameraBtn img');
        if (isCameraOn) {
            cameraIcon.src = "WRTC-master/images/camera-solid-24.png";
        } else {
            cameraIcon.src = "WRTC-master/images/camera-off-solid-24.png";
        }
        dataChannel.send(JSON.stringify({ type: 'cameraToggle', isCameraOn: isCameraOn }));
    };

    // function toggleRemoteCamera() {
    //     remoteStream.getVideoTracks()[0].enabled = isRemoteCameraOn;
    // }

    $('#cameraBtn').click(toggleCamera)
    
    // Bật/tắt mic
    let isMicOn = true;
    $('#micBtn').click(() => {
        isMicOn = !isMicOn;
        localStream.getAudioTracks()[0].enabled = isMicOn;
        const micIcon = document.querySelector('#micBtn img');
        if (isMicOn) {
            micIcon.src = "WRTC-master/images/microphone-solid-24.png"
        } else {
            micIcon.src = "WRTC-master/images/microphone-off-solid-24.png"
        }
    });

    

    // Xử lý sự kiện Data Channel
    peer.on('data', data => {
        const message = JSON.parse(data);
    
        // Kiểm tra nếu là yêu cầu bật/tắt camera
        if (message.type === 'cameraToggle') {
            const { isCameraOn } = message;
            toggleRemoteCamera(isCameraOn);
        }
    });

    //quiz
    const optionMenu = document.querySelector(".quiz-menu"),
       selectBtn = optionMenu.querySelector(".select-btn"),
       options = optionMenu.querySelectorAll(".option"),
       sBtn_text = optionMenu.querySelector(".sBtn-text");

    selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));       

    options.forEach(option =>{
    option.addEventListener("click", ()=>{
        let selectedOption = option.querySelector(".option-text").innerText;
        sBtn_text.innerText = selectedOption;

        optionMenu.classList.remove("active");
        });
    });
    

    // Caller: người gọi
    $("#btnCall").click(() => {
        const id = $("#remoteID").val();
        openStream()
            .then(stream => {
                playStream('localStream', stream);
                const call = peer.call(id, stream);
                call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
            });
    })
    // Callee: người nhận
    peer.on('call', call => {
        openStream()
            .then(stream => {
                call.answer(stream);
                playStream('localStream', stream);
                call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
            });
    });

    // socket.on('connect', () => {
    //     console.log('Connected to the server');
    // });

   $('#ulUser').on('click', 'li', function() {
        const id = $(this).attr('id');

        openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
   });

});



////////////////////////////////////

/*const CONFIG_NON_STUN_TURN_SERVER = {
    host: "127.0.0.1",
    port: 9090,
    path: '/peerserver'    
};

let peer = new Peer('null', CONFIG_NON_STUN_TURN_SERVER);*/
