dojo.provide("widgets.player");
dojo.require("dijit._Widget");

dojo.declare('widgets.player', [dijit._Widget], {
    
    playerData: {}, 

    constructor: function() {
        this.hp = 100;
        this.gold = 100;
        this.maxHP = this.hp;
        this.strength = 0;
        this.defense = 0;
        this.potions = new Array();
        this.weapon = null;
        this.armor = null;
        this.specialItems = new Array();
        this.ready = false;
        var def = uow.getAudio({defaultCaching: true});
        def.then(dojo.hitch(this, function(audio) { 
            this._audio = audio;
            this.ready = true;
        }));
    },
    
    postCreate: function() {},

    reset: function(direction){
        this.hp = this.maxHP = this.gold = 100;
        this.strength = this.defense = 0;
        this.weapon = null;
        this.armor = null;
    },

    readStats: function(){
        var def = new dojo.Deferred();
        if(this.ready)
        {
            this._audio.say({text: 'You currently have strength of ' + this.strength});
            this._audio.say({text: 'You currently have defense of ' + this.defense});
            this._audio.say({text: 'You currently have ' + this.hp + ' hit points.'});
            this._audio.say({text: 'You currently have ' + this.gold + ' gold.'});
            if(this.potions.length > 0){

            }
            else{
                this._audio.say({text: 'You currently have no potions.'});
            }     
            if(this.specialItems.length > 0){

            }
            else{
                this._audio.say({text: 'You currently have no specialItems.'})
                    .anyAfter(dojo.hitch(this, function(){
                        def.callback();
                    }));
            }               

        }
        return def;
    },

    /*
        equipWeakItems: Find weakest weapon & armor in map and add to player
    */
    equipWeakItems: function(map){
	    var lowArmor, lowWeapon;
        var aValue = Infinity;
        var wValue = Infinity;
	    dojo.forEach(map.items, dojo.hitch(this,function(item, index){
		    switch(item.iType)
		    {
                case dojo.global.WEAPON:
			        if(item.iValue < wValue)
			        {
                        wValue = item.iValue;
                        lowWeapon = index;
			        }
                    break;
		        case dojo.global.ARMOR:
			        if(item.iValue < aValue)
			        {
                        aValue = item.iValue;
                        lowArmor = index;
			        }
                    break;
		    }
	    }));
	    this.weapon = map.items[lowWeapon];
	    this.armor = map.items[lowArmor];
    },
    /*
        updates hp in respone to integer change
    */
    updateHP: function(change){
        this.hp+=change;
    }
});