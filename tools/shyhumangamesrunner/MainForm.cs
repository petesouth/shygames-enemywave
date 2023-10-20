using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using System.Windows.Forms;
using CefSharp;
using CefSharp.WinForms;

namespace shyhumangamesrunner
{
    public partial class MainForm : Form
    {
        private HttpListener _httpListener;

        public MainForm()
        {
            InitializeComponent();
        }

        private void MainForm_Load(object sender, EventArgs e)
        {
            // Start the local web server on a separate thread
            Task.Run(() => StartWebServer());

            ChromiumWebBrowser browser = new ChromiumWebBrowser("http://127.0.0.1:3636/index.html")
            {
                Dock = DockStyle.Fill
            };

            Controls.Add(browser);
        }

        private void StartWebServer()
        {
            _httpListener = new HttpListener();
            _httpListener.Prefixes.Add("http://127.0.0.1:3636/");
            _httpListener.Start();

            while (_httpListener.IsListening)
            {
                try
                {
                    var context = _httpListener.GetContext();
                    Task.Run(() => ProcessRequest(context));
                }
                catch (HttpListenerException) { /* Handle exception if needed */ }
            }
        }

        private void ProcessRequest(HttpListenerContext context)
        {
            string filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, context.Request.Url.LocalPath.TrimStart('/'));
            if (File.Exists(filePath))
            {
                byte[] buffer = File.ReadAllBytes(filePath);
                context.Response.OutputStream.Write(buffer, 0, buffer.Length);
                context.Response.Close();
            }
            else
            {
                context.Response.StatusCode = 404;
                context.Response.Close();
            }
        }

        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            base.OnFormClosing(e);
            _httpListener.Stop();
        }
    }
}
