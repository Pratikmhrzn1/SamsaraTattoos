import chalk from "chalk";
const log = (type,msg)=>{
    const time = new Date().toLocaleTimeString();
    if(type === "success"){
        console.log(chalk.green(`[${time}]SUCCESS:${msg}`))
    }
    if(type === "error"){
        console.log(chalk.red(`[${time}]ERROR:${msg}`))
    }
    if(type === "info"){
        console.log(chalk.blue(`[${time}]INFO:${msg}`))
    }
}
export default log;