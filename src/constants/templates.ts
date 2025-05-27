export const templates = [
  {
    id: "blank",
    label: "空白文档",
    imageUrl: "/blank-document.svg",
    //中文初始化内容
    initialContent: "",
  },
  {
    id: "software-proposal",
    label: "软件项目提案",
    imageUrl: "/software-proposal.svg",
    initialContent: `<h1>软件项目提案</h1>
    
    <div class="header">
        <p>提案编号：PRO-2023-001</p>
        <p>提交日期：2023-10-01</p>
        <p>提案单位：XX科技有限公司</p>
    </div>
    <h2>一、项目背景</h2>
    <ul>
        <li>问题陈述：现有系统效率低下...</li>
        <li>目标用户：企业管理人员</li>
    </ul>
    <h2>二、核心功能</h2>
    <table border="1">
        <tr>
            <th>模块</th>
            <th>描述</th>
        </tr>
        <tr>
            <td>用户管理</td>
            <td>支持多角色权限控制</td>
        </tr>
    </table>
    <h2>三、技术方案</h2>
    <div>
        <h3>架构设计</h3>
        <ul>
            <li>前端：Vue3</li>
            <li>后端：Spring Boot</li>
        </ul>
    </div>
    <h2>四、项目计划</h2>
    <table border="1">
        <tr>
            <th>阶段</th>
            <th>周期</th>
        </tr>
        <tr>
            <td>需求分析</td>
            <td>2周</td>
        </tr>
    </table>
    <h2>五、预算估算</h2>
    <table border="1">
        <tr>
            <td>开发成本</td>
            <td>￥150,000</td>
        </tr>
    </table>`,
  },
  {
    id: "project-proposal",
    label: "项目提案",
    imageUrl: "/project-proposal.svg",
    initialContent: `<h1>项目提案</h1>
    
    <!-- 基础信息 -->
    <div>
        <p>提案编号：PROJ-EXAMPLE-2023 [<sup data-citation='{&quot;url&quot;:&quot;https://example.com&quot;,&quot;title&quot;:&quot;Example Domain&quot;,&quot;content&quot;:&quot;This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.\n\n[More information...](https://www.iana.org/domains/example)&quot;}'>1</sup>](https://example.com)</p>
        <p>提交日期：<span id="currentDate"></span></p>
        <p>提案单位：example.com示范团队 [<sup data-citation='{&quot;url&quot;:&quot;https://example.com&quot;,&quot;title&quot;:&quot;Example Domain&quot;,&quot;content&quot;:&quot;This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.\n\n[More information...](https://www.iana.org/domains/example)&quot;}'>1</sup>](https://example.com)</p>
    </div>
    <!-- 项目背景 -->
    <h2>1. 项目背景</h2>
    <ul>
        <li>示范领域：信息技术服务（参考example.com用例[<sup data-citation='{&quot;url&quot;:&quot;https://example.com&quot;,&quot;title&quot;:&quot;Example Domain&quot;,&quot;content&quot;:&quot;This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.\n\n[More information...](https://www.iana.org/domains/example)&quot;}'>1</sup>](https://example.com)）</li>
        <li>需求说明：提升系统交互效率</li>
    </ul>
    <!-- 核心目标 -->
    <h2>2. 项目目标</h2>
    <table border="1">
        <tr>
            <th>阶段</th>
            <th>预期成果</th>
        </tr>
        <tr>
            <td>第一期</td>
            <td>完成基础架构搭建</td>
        </tr>
    </table>
    <!-- 资源引用 -->
    <footer>
        <p>参考文献：</p>
        <ol>
            <li>[<sup data-citation='{&quot;url&quot;:&quot;https://example.com&quot;,&quot;title&quot;:&quot;Example Domain&quot;,&quot;content&quot;:&quot;This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.\n\n[More information...](https://www.iana.org/domains/example)&quot;}'>1</sup>](https://example.com) <a href="https://example.com">示例域名使用规范</a></li>
        </ol>
    </footer>
    <script>
        // 自动填充日期
        document.getElementById('currentDate').textContent = new Date().toUTCString().split('T')[0];
    </script>`,
  },
  {
    id: "business-letter",
    label: "商业信函",
    imageUrl: "/business-letter.svg",
    initialContent: `<header>
        <h1>示例有限公司 [1]</h1>
        <address>
            <p>地址：example.com示范大厦</p>
            <p>电话：+86 555-0100</p>
        </address>
    </header>
    <!-- 日期 -->
    <div class="date">
        <span id="currentDate"></span>
    </div>
    <!-- 收件人 -->
    <div class="recipient">
        <address>
            <p>致：示例集团采购部</p>
            <p>地址：example.com示范园区</p>
        </address>
    </div>
    <!-- 正文 -->
    <div class="content">
        <p>尊敬的合作伙伴：</p>
        <p>此处填写信件正文内容...</p>
        <p>我们参考example.com的标准化格式[1]，特此提出合作意向。</p>
    </div>
    <!-- 结尾 -->
    <div class="signature">
        <p>此致</p>
        <p>示例有限公司</p>
        <p>张三（市场总监）</p>
    </div>
    <!-- 引用声明 -->
    <footer>
        <p>[1] 格式参考自 <a href="https://example.com">示例域名规范</a></p>
    </footer>
    <script>
        // 自动生成日期
        document.getElementById('currentDate').textContent = new Date().toLocaleDateString('zh-CN');
    </script>`,
  },
  {
    id: "resume",
    label: "简历",
    imageUrl: "/resume.svg",
    initialContent: `<header>
        <h1>李小明</h1>
        <address>
            <p>📍 example.com示范市[1]</p>
            <p>📞 +86 138-0101-EXAM</p>
            <p>📧 resume@example.com</p>
        </address>
    </header>
    <!-- 教育背景 -->
    <section>
        <h2>教育经历</h2>
        <table>
            <tr>
                <td>2016-2020</td>
                <td>
                    <strong>示例大学[1]</strong><br>
                    计算机科学与技术（GPA 3.8/4.0）
                </td>
            </tr>
        </table>
    </section>
    <!-- 工作经历 -->
    <section>
        <h2>工作经历</h2>
        <div class="experience">
            <h3>高级开发工程师 @ 示例科技[1]</h3>
            <p>2020.07-至今</p>
            <ul>
                <li>主导开发基于example.com的API管理系统</li>
                <li>团队项目管理与跨部门协作</li>
            </ul>
        </div>
    </section>
    <!-- 技能 -->
    <section>
        <h2>专业技能</h2>
        <ul>
            <li>HTML/CSS/JavaScript（精通）</li>
            <li>Python/Java（熟练）</li>
            <li>项目管理（PMP认证）</li>
        </ul>
    </section>
    <!-- 参考文献 -->
    <footer>
        <p>[1] 示例信息引用自 <a href="https://example.com">域名规范文档</a></p>
    </footer>
    <style>
        /* 基础排版 */
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        address { font-style: normal; }
        section { margin-bottom: 2rem; }
    </style>`,
  },
  {
    id: "cover-letter",
    label: "求职信",
    imageUrl: "/cover-letter.svg",
    initialContent: `<!-- 发件人信息 -->
    <header>
        <address>
            <p>王大卫</p>
            <p>📍 example.com示范街区[1]</p>
            <p>📧 david@example.com</p>
            <p>📞 +86 139-EXAM-PLE</p>
        </address>
    </header>
    <!-- 日期 -->
    <div class="date">
        <script>
            document.write(new Date().toLocaleDateString('zh-CN'))
        </script>
    </div>
    <!-- 收件人 -->
    <div class="recipient">
        <p>示例科技招聘部</p>
        <p>地址：example.com人才大厦</p>
    </div>
    <!-- 正文 -->
    <section>
        <p>尊敬的招聘主管：</p>
        
        <article>
            <p>获悉贵司在example.com发布的[高级前端工程师]岗位...</p>
            
            <h3>核心优势：</h3>
            <ul>
                <li>5年example.com生态开发经验</li>
                <li>主导过3个百万级用户项目</li>
                <li>熟悉Vue/React技术栈</li>
            </ul>
            <p>随附简历供参考，期待与您进一步沟通。</p>
        </article>
    </section>
    <!-- 结尾 -->
    <div class="sign-off">
        <p>此致</p>
        <p>王大卫</p>
        <p>（附：个人作品集 https://david.example.com）</p>
    </div>
    <!-- 引用声明 -->
    <footer>
        <p>[1] 示例地址参考自<a href="https://example.com">标准化模板</a></p>
    </footer>
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            line-height: 1.8;
            max-width: 800px;
            margin: 2rem auto;
        }
        address { margin-bottom: 1.5rem; }
        .date { margin: 1rem 0; }
    </style>`,
  },
  {
    id: "letter",
    label: "通用信函",
    imageUrl: "/letter.svg",
    initialContent: `<header>
        <address>
            <strong>[发件人姓名]</strong><br>
            example.com示范大厦[1]<br>
            示范市, 邮编 100000<br>
            📞 +86 010-EXAM-PLE
        </address>
        <p>日期：[YYYY年MM月DD日]</p>
    </header>
    <!-- 收件信息 -->
    <address>
        <strong>[收件人姓名/单位]</strong><br>
        example.com示范园区[1]<br>
        示范市, 邮编 100000
    </address>
    <!-- 正文 -->
    <section class="letter-body">
        <p>[称呼语]：</p>
        
        <p>我谨代表[单位名称]，就[事由]向贵方正式致函。本函涉及example.com[1]示范项目框架下的合作事宜，具体包含以下要点：</p>
        <ul>
            <li>项目背景说明（基于example.com[1]规范）</li>
            <li>合作条款概要</li>
            <li>后续行动计划</li>
        </ul>
        <p>请于[截止日期]前通过example.com[1]官方渠道回复确认。</p>
    </section>
    <!-- 结尾 -->
    <div class="signature">
        <p>此致</p>
        <p><strong>[发件人签名]</strong></p>
        <p>[发件人职务]</p>
    </div>
    <!-- 引用声明 -->
    <footer>
        <p>[1] 机构信息引用自 <a href="https://example.com">IANA示例域名规范</a></p>
    </footer>`,
  },
];
