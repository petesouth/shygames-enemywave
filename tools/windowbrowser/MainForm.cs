using System;
using System.Windows.Forms;
using CefSharp;
using CefSharp.WinForms;

namespace windowbrowser
{


    public partial class MainForm : Form
    {
        public MainForm()
        {
            InitializeComponent();

        }

        private void MainForm_Load(object sender, EventArgs e)
        {
                ChromiumWebBrowser browser = new ChromiumWebBrowser("http://127.0.0.1:3636/index.html")
                {
                    Dock = DockStyle.Fill
                };

                Controls.Add(browser);
 
        }

    }
    
}
