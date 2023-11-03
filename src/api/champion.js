/*
* 获取英雄信息
*/
export function getChampionInfo(champion,level){
    calculationLevelAddition(champion,level)
}

export function getSimulation(champion,level,items,targetArmor=0,targetMr=0){
    if (level<1||level>3){
        level=1
    }
    calculationLevelAddition(champion,level)
    if (items!=undefined&&items!=null&&items.length>0){
        champion.itemList = items
        calculationItemAddition(champion,items)
    }
    return generateDamageList(champion,targetArmor,targetMr)
}
export function getAbilitySimulation(champion,level,items,targetArmor=0,targetMr=0){
    if (level<1||level>3){
        level=1
    }
    calculationLevelAddition(champion,level)
    if (items!=undefined&&items!=null&&items.length>0){
        champion.itemList = items
        console.log(champion)
        calculationItemAddition(champion,items)
    }
    return generateAbilityList(champion,targetArmor,targetMr)
}


/*
* 生成伤害列表数据
 */
function generateDamageList(championDto,targetArmor,targetMr){
    let time = 0.0
    let atkInterval = 1.0/championDto.atkSpeed
    let itemLastTime = 0.0
    //时间戳
    let timestamp = [0.0]
    //攻击伤害
    let atkDamageList = [0]
    //技能 物理/魔法/真实/总伤害
    let abilityPhysicalDamageList = [0]
    let abilityMagicDamageList = [0]
    let abilityRealDamageList = [0]
    let abilityTotalDamageList = [0]
    //装备伤害
    let itemDamageList = [0]
    //累计造成总伤害 = 攻击伤害+技能总伤害+装备伤害
    let totalDamageList = [0]

    while (time<=30.0){
        let totalDamage = 0
        if (championDto.initialMana>=championDto.mana){
            //释放技能
            let abilityDamage = getAbilityDamage(championDto, targetArmor, targetMr);
            abilityTotalDamageList.push(abilityDamage);
            if (championDto.abilityDamageType==0){
                abilityPhysicalDamageList.push(abilityDamage)
                abilityMagicDamageList.push(0)
                abilityRealDamageList.push(0)
            }else if (championDto.abilityDamageType==1){
                abilityPhysicalDamageList.push(0)
                abilityMagicDamageList.push(abilityDamage)
                abilityRealDamageList.push(0)
            }else if (championDto.abilityDamageType==2){
                abilityPhysicalDamageList.push(0)
                abilityMagicDamageList.push(0)
                abilityRealDamageList.push(abilityDamage)
            }
            championDto.initialMana=0;
            totalDamage+=abilityDamage;
        }else{
            abilityPhysicalDamageList.push(0);
            abilityMagicDamageList.push(0);
            abilityRealDamageList.push(0);
            abilityTotalDamageList.push(0);
        }
        //计算攻击
        let atkDamage = getAtkDamage(championDto, targetArmor, targetMr);
        atkDamageList.push(atkDamage);
        totalDamage+=atkDamage;

        let itemsSpeedAtk = 0.0;
        let itemsDamageSecond = 0;
        let itemsDamageAtk = 0;
        let itemsManaAtk = 0;
        //计算装备相关
        if (championDto.itemList!=undefined&&championDto.itemList!=null&&championDto.itemList.length>0){
            //1.计算装备每秒伤害
            if (time>=itemLastTime){
                itemsDamageSecond = parseInt(parseInt(time-itemLastTime)*getItemsDamageSecond(championDto,targetArmor,targetMr));
                itemLastTime=parseInt(time);
            }
            //2.计算装备攻击伤害
            itemsDamageAtk = getItemsDamageAtk(championDto,targetArmor,targetMr);

            //3.计算装备回蓝
            itemsManaAtk = getItemsManaAtk(championDto);
            //4.计算装备增加攻速
            itemsSpeedAtk = getItemsSpeedAtk(championDto);
        }
        itemDamageList.push(itemsDamageSecond+itemsDamageAtk);
        totalDamage+=(itemsDamageSecond+itemsDamageAtk);
        //更新蓝量-装备回蓝+攻击回蓝
        championDto.initialMana=championDto.initialMana+10+itemsManaAtk
        //更新攻速-装备攻速
        championDto.atkSpeedAddition=championDto.atkSpeedAddition+itemsSpeedAtk
        championDto.atkSpeed=Math.min(5.0,championDto.initialAtkSpeed*(1.0+championDto.atkSpeedAddition))
        time+=atkInterval
        atkInterval = 1.0/championDto.atkSpeed
        timestamp.push(time)
        totalDamageList.push(totalDamageList[totalDamageList.length-1]+totalDamage)
    }
    let map = {}
    map.timestamp=timestamp
    map.atkDamageList=atkDamageList
    map.timestamp=timestamp
    map.abilityPhysicalDamageList=abilityPhysicalDamageList
    map.abilityMagicDamageList=abilityMagicDamageList
    map.abilityRealDamageList=abilityRealDamageList
    map.abilityTotalDamageList=abilityTotalDamageList
    map.itemDamageList=itemDamageList
    map.totalDamageList=totalDamageList
    return map;
}

/*
* 生成技能数据
 */
function generateAbilityList(champion,targetArmor,targetMr){
    let abilityPhysicalDamage=0;
    let abilityMagicDamage=0;
    let abilityRealDamage=0;
    let abilityTotalDamage = 0;
    let abilityDamage = getAbilityDamage(champion, targetArmor, targetMr);

    if (champion.abilityDamageType==0){
        abilityPhysicalDamage=abilityDamage;
    }else if (champion.abilityDamageType==1){
        abilityMagicDamage=(abilityDamage);
    }else if (champion.abilityDamageType==2){
        abilityRealDamage=(abilityDamage);
    }
    abilityTotalDamage=abilityPhysicalDamage+abilityMagicDamage+abilityRealDamage;
    let map = {}
    map.physicalDamage=abilityPhysicalDamage
    map.magicDamage=abilityMagicDamage
    map.realDamage=abilityRealDamage
    map.totalDamage=abilityTotalDamage
    return map;
}

function getAbilityDamage(championDto,targetArmor,targetMr){
    //物理伤害= 技能伤害 * 护甲承伤
    if (championDto.abilityDamageType==0){
        targetArmor = Math.floor(targetArmor * (1-championDto.sunder));
        return Math.floor(abilityDamageExp(championDto) * sufferCoefficient(targetArmor));
    }
    //魔法伤害= 技能伤害 * 魔抗承伤
    else if (championDto.abilityDamageType==1){
        targetMr = Math.floor(targetMr * (1-championDto.shred));
        return Math.floor(abilityDamageExp(championDto) * sufferCoefficient(targetMr));
    }
    //真实伤害= 技能伤害 * 1
    else{
        return Math.floor(abilityDamageExp(championDto));
    }
}

/**
 * 技能伤害期望 技能伤害*(1+技能修正+伤害修正)*可否暴击
 * @param championDto
 * @return
 */
function abilityDamageExp(championDto){
    let abilityCorrection = championDto.abilityCorrection
    let damageCorrection = championDto.damageCorrection
    //物理加成
    let physicalDamage = championDto.damage * championDto.abilityPhysicalDamage * (1 + abilityCorrection + damageCorrection);
    //魔法加成
    let magicDamage = championDto.abilityPower * championDto.abilityMagicDamage * (1 + abilityCorrection + damageCorrection);
    //真实加成
    let realDamage = championDto.abilityPower * championDto.abilityRealDamage * (1 + abilityCorrection + damageCorrection);
    //总伤害
    let totalDamage = physicalDamage+magicDamage+realDamage;
    //可暴击
    if (championDto.abilityCrit==1){
        totalDamage = totalDamage * critCoefficient(championDto);
    }
    return totalDamage;
}

/*
* 计算星级加成
*/
function calculationLevelAddition(champion,level){
    champion.health = Math.floor(champion.health*Math.pow(1.8,level-1))
    champion.damage = Math.floor(champion.damage*Math.pow(1.5,level-1))
    if (level<1||level>3){
        level=1
    }
    if (level===1){
        champion.abilityPhysicalDamage=champion.abilityPhysicalDamage1
        champion.abilityMagicDamage=champion.abilityMagicDamage1
        champion.abilityRealDamage=champion.abilityRealDamage1
    }else if (level===2){
        champion.abilityPhysicalDamage=champion.abilityPhysicalDamage2
        champion.abilityMagicDamage=champion.abilityMagicDamage2
        champion.abilityRealDamage=champion.abilityRealDamage2
    }else if (level===3){
        champion.abilityPhysicalDamage=champion.abilityPhysicalDamage3
        champion.abilityMagicDamage=champion.abilityMagicDamage3
        champion.abilityRealDamage=champion.abilityRealDamage3
    }
    updateChampion(champion)
}

/*
* 计算装备加成
*/
function calculationItemAddition(championDto,itemList){
    console.log(itemList)
    championDto.itemList = itemList
    if (itemList.length>0){
        for(let item of itemList){
            console.log(item)
            equipItem(championDto,item)
        }
    }
    //刷新属性
    updateChampion(championDto)
}

/**
 * 计算攻击伤害
 * @param championDto 攻击者
 * @param targetArmor 承伤者护甲-击碎后
 * @param targetMr 承伤者魔抗-击碎后
 * @return 攻击造成的实际伤害
 */
function getAtkDamage(championDto,targetArmor,targetMr){
    targetArmor = Math.floor(targetArmor*(1-championDto.sunder))
    return Math.floor(atkDamageExp(championDto)*sufferCoefficient(targetArmor))
}
/**
 * 攻击伤害期望 - 攻击*暴击系数*(1+攻击修正+伤害修正)
 * @param championDto
 * @return 攻击伤害期望
 */
function atkDamageExp(championDto){
    let damage = championDto.damage
    let atkCorrection = championDto.atkCorrection
    let damageCorrection = championDto.damageCorrection
    return damage * critCoefficient(championDto) * (1+atkCorrection+damageCorrection)
}

/**计算装备每秒伤害
 *
 * @param championDto
 * @param targetArmor
 * @param targetMr
 * @return
 */
function getItemsDamageSecond(championDto,targetArmor,targetMr){
    let totalDamage = 0
    let itemList = championDto.itemList
    if (itemList!=undefined&&itemList!=null&&itemList.length>0){
        for(let item of itemList){
            totalDamage+=getOtherDamage(championDto,Math.floor(item.damagePerSecond),false,targetArmor,targetMr,item.damageType)
        }
    }
    return totalDamage
}

/**计算装备每次攻击伤害
 *
 * @param championDto
 * @param targetArmor
 * @param targetMr
 * @return
 */
function getItemsDamageAtk(championDto,targetArmor,targetMr){
    let totalDamage = 0
    let itemList = championDto.itemList
    if (itemList!=undefined&&itemList!=null&&itemList.length>0){
        for(let item of itemList){
            totalDamage += getOtherDamage(championDto,item.damagePerAtk,false,targetArmor,targetMr,item.damageType)
        }
    }
    return totalDamage
}
/**计算装备每次攻击回蓝
 *
 * @param championDto
 * @return
 */
function getItemsManaAtk(championDto){
    let mana = 0
    let itemList = championDto.itemList
    if (itemList!=undefined&&itemList!=null&&itemList.length>0){
        for(let item of itemList){
            mana+=item.perMana
        }
    }
    return mana
}
/**计算装备每次攻击增加的攻速
 *
 * @param championDto
 * @return
 */
function getItemsSpeedAtk(championDto){
    let speed = 0.0
    let itemList = championDto.itemList
    if (itemList!=undefined&&itemList!=null&&itemList.length>0){
        for(let item of itemList){
            speed+=item.perAtkSpeed
        }
    }
    return speed
}

/**
 * 计算装备加成
 * @param championDto
 * @param itemEntity
 */
function equipItem(championDto,itemEntity) {
    championDto.healthAddition = championDto.healthAddition + itemEntity.health
    championDto.damageAddition = championDto.damageAddition + itemEntity.damage
    championDto.abilityPowerAddition = championDto.abilityPowerAddition + itemEntity.abilityPower
    championDto.atkSpeedAddition = championDto.atkSpeedAddition + itemEntity.atkSpeed
    championDto.initialMana = championDto.initialMana + itemEntity.initialMana
    championDto.mana = championDto.mana + itemEntity.mana
    championDto.armor = championDto.armor + itemEntity.armor
    championDto.mr = championDto.mr + itemEntity.mr
    championDto.omnivamp = championDto.omnivamp + itemEntity.omnivamp
    championDto.critRate = championDto.critRate + itemEntity.critRate
    championDto.critDamage = championDto.critDamage + itemEntity.critDamage
    championDto.abilityCrit = championDto.abilityCrit | itemEntity.abilityCrit
    championDto.abilityCorrection = championDto.abilityCorrection + itemEntity.abilityCorrection
    championDto.atkCorrection = championDto.atkCorrection + itemEntity.atkCorrection
    championDto.damageCorrection = championDto.damageCorrection + itemEntity.damageCorrection
    championDto.sunder = Math.max(championDto.sunder, itemEntity.sunder)
    championDto.shred = Math.max(championDto.shred, itemEntity.shred)
}
/**
 * 刷新英雄属性
 * @param championDto
 */
function updateChampion(championDto){
    championDto.health=championDto.health+championDto.healthAddition;
    championDto.damage=Math.floor(championDto.damage*(1+championDto.damageAddition))
    championDto.atkSpeed=championDto.initialAtkSpeed*(1+championDto.atkSpeedAddition)
    if (championDto.critRate>=1.0){
        championDto.critDamage = championDto.critDamage+0.8*(championDto.critRate-1.0)
        championDto.critRate=(1.0)
    }
    championDto.abilityPower=(championDto.abilityPower+championDto.abilityPowerAddition)

}


/**
 * 计算其他伤害
 * @param championDto 攻击者
 * @param damage 伤害量
 * @param isCritAble 可否暴击
 * @param targetArmor 承伤者护甲-击碎后
 * @param targetMr 承伤者魔抗-击碎后
 * @param damageType 伤害类型
 * @return
 */
function getOtherDamage(championDto,damage,isCritAble,targetArmor,targetMr,damageType){
    let totalDamage = damage
    //计算伤害加成
    totalDamage *=(1+championDto.damageCorrection)
    //计算暴击
    if(isCritAble){
        totalDamage *= critCoefficient(championDto)
    }
    //计算穿甲
    targetArmor = Math.floor(targetArmor * (1-championDto.sunder))
    targetMr = Math.floor(targetMr * (1-championDto.shred))
    //计算护甲减伤
    if (damageType==0){
        totalDamage *= sufferCoefficient(targetArmor)
    }else if (damageType==1){
        totalDamage *= sufferCoefficient(targetMr)
    }else{
        totalDamage *=1
    }
    return parseInt(totalDamage)
}
/**
 * 暴击系数期望
 * @param championDto
 * @return
 */
function critCoefficient(championDto){
    let critRate = championDto.critRate
    let critDamage = championDto.critDamage
    return critDamage * critRate + 1.0 - critRate
}
/**
 * 承伤系数 = 1 - 减伤系数
 * @param resistance
 * @return
 */
function sufferCoefficient(resistance){
    return 1.0 - resisCoefficient(resistance)
}
/**
 * 减伤系数
 * @param resistance
 * @return
 */
function resisCoefficient(resistance){
    return resistance / (Math.abs(resistance)+100.0)
}