const OSS = require('ali-oss');

const client = new OSS({
  region: 'oss-cn-hangzhou',
  // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID || '',
  accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET || '',
  bucket: 'asdkfj',
});

const rules = [
  {
    // 指定允许跨域请求的来源，支持通配符星号（*），表示允许所有的来源域。
    allowedOrigin: '*',
    // 指定允许的跨域请求方法，支持GET、PUT、DELETE、POST和HEAD方法。
    allowedMethod: 'GET',
    // 指定允许跨域请求的响应头。建议无特殊情况下将此项设置为通配符星号（*）。
    allowedHeader: '*',
    // 指定允许用户从应用程序中访问的响应头，例如一个JavaScript的XMLHttpRequest对象。不允许使用通配符星号（*）。
    exposeHeader: 'Content-Length',
    // 指定浏览器对特定资源的预取（OPTIONS）请求返回结果的缓存时间，单位为秒。
    maxAgeSeconds: '30',
  },
];
// 最多允许设置10条跨域资源共享规则。如果配置了相同的规则，则已存在的规则将被覆盖。
client.putBucketCORS('asdkfj', rules).then((r) => {
  console.log(r);
});
