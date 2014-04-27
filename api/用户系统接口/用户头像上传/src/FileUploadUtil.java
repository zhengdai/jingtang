package irdc.ex08_11;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;

import android.content.Context;
import android.os.Handler;
import android.widget.Toast;

public class FileUploadUtil{
    private Handler handler;
    private static FileUploadUtil util = null;
    private FileUploadUtil(){
        handler = new Handler();
    }
    public static FileUploadUtil getInstence(){
        if(util == null){
            util = new FileUploadUtil();
        }
        return util;
    }
    public void upload(final String action,final Map<String,String> params,final String filePath,final FileUploadListener listener){
        handler.post(new Runnable(){
            @Override
            public void run(){
                StringBuffer url = new StringBuffer(action);
                if(!action.endsWith("?")){
                    url = url.append("?");
                }
                for (String key : params.keySet()){
                    url.append(key);
                    url.append("=");
                    url.append(params.get(key));
                    url.append("&");
                }
                url.deleteCharAt(url.length()-1);
                String end = "\r\n";
                String twoHyphens = "--";
                String boundary = "******";
                try{
                    URL urlU = new URL(url.toString());
                    HttpURLConnection httpURLConnection = (HttpURLConnection) urlU
                        .openConnection();
                    httpURLConnection.setDoInput(true);
                    httpURLConnection.setDoOutput(true);
                    httpURLConnection.setUseCaches(false);
                    httpURLConnection.setRequestMethod("POST");
                    httpURLConnection.setRequestProperty("Connection", "Keep-Alive");
                    httpURLConnection.setRequestProperty("Charset", "UTF-8");
                    httpURLConnection.setRequestProperty("Content-Type",
                        "multipart/form-data;boundary=" + boundary);
                    DataOutputStream dos = new DataOutputStream(httpURLConnection
                        .getOutputStream());
                    dos.writeBytes(twoHyphens + boundary + end);
                    dos
                        .writeBytes("Content-Disposition: form-data; name=\"file\"; filename=\""
                            + filePath.substring(filePath.lastIndexOf("/") + 1)
                            + "\"" + end);
                    dos.writeBytes(end);
  
                    FileInputStream fis = new FileInputStream(filePath);
                    byte[] buffer = new byte[8192]; // 8k
                    int count = 0;
                    while ((count = fis.read(buffer)) != -1)
                    {
                      dos.write(buffer, 0, count);
  
                    }
                    fis.close();
  
                    dos.writeBytes(end);
                    dos.writeBytes(twoHyphens + boundary + twoHyphens + end);
                    dos.flush();
  
                    InputStream is = httpURLConnection.getInputStream();
                    InputStreamReader isr = new InputStreamReader(is, "utf-8");
                    BufferedReader br = new BufferedReader(isr);
                    String result = br.readLine();
                    dos.close();
                    is.close();
                    listener.onSuccess(result);
                } catch (Exception e){
                    listener.onFailure("Error");
                }
            }
        });
    }
}
