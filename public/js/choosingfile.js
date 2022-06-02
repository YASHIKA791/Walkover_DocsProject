const inputfile = document.getElementById('input-file');
inputfile.addEventListener('change', saveFile);

function saveFile() {
  const filepath = document.getElementById('input-file').value;
  const wrkspc_id = document.getElementById('workspaceid').value;
  const user_id = document.getElementById('user').value;
  console.log(filepath);
    let filename = "";
    for(let i=filepath.length-1; i>=0; i--) {
        if(filepath[i] >= 'A' && filepath[i] <= 'Z') 
            filename = filepath[i] + filename;
        else if(filepath[i] >= 'a' && filepath[i] <= 'z' )
            filename = filepath[i] + filename;
        else if(filepath[i]==='.')
            filename = filepath[i] + filename;
        else break;
    }
    console.log(filename);
    var fr=new FileReader();
    fr.onload=function(){
        let filecontent =fr.result;

        async function saveFileAndContent() {
            var details = {
                'filename': filename,
                'filecontent': filecontent,
                'workspace_id': wrkspc_id,
                'user_id': user_id
            };

            var formBody = [];
            for (var property in details) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");

            const option = {
                method: "POST",
                headers:              {
                    "Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8',
                },
                body: formBody
            }

            let result = await fetch("/api/saveFileAndContent", option).then((res) => res.json());
            // console.log(result);
        }
        saveFileAndContent();
        window.location.href = "/user/" + user_id + "/workspace/" + wrkspc_id;
    }
    
    fr.readAsText(this.files[0]);
}

const workspace = document.getElementById('workspace');
workspace.addEventListener('click', function() {
    console.log(window.location.href);
})

function contact() {
    window.location.href = "/";
}